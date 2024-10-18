const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { tcRouter, filterData } = require('../tc');
const runPythonProcess = require('../../runPythonProcess');

jest.mock('fs');
jest.mock('../../runPythonProcess');

const app = express();
app.use(express.json());
app.use('/tc', tcRouter);

describe('TC Routes', () => {
  describe('GET /tc/byDate/:date', () => {
    test('should return a list of tcs for a given date', async () => {
      const mockDate = '2023-09-01';
      const mockTcNameIDList = [{ id: '1', name: 'TC1' }];
      const mockTcData = [{ id: '1', center: [[0, 0]], time: ['2023-09-01 00-00-00'] }];

      runPythonProcess.mockResolvedValueOnce(JSON.stringify(mockTcNameIDList));
      runPythonProcess.mockResolvedValueOnce(JSON.stringify([...mockTcData, null]));

      const response = await request(app).get(`/tc/byDate/${mockDate}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTcNameIDList.map((tc, index) => ({ ...tc, ...mockTcData[index], minFrame: 0 })));
    });

    test('should return 400 if there is an error', async () => {
      const mockDate = '2023-09-01';
      runPythonProcess.mockRejectedValueOnce(new Error('Python error'));

      const response = await request(app).get(`/tc/byDate/${mockDate}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Python error');
    });
  });

  describe('GET /tc/byID/:tcID', () => {
    test('should return time and latlng data for a given tc by ID', async () => {
      const mockTcID = '1';
      const mockTcData = [{ id: '1', center: [[0, 0]], time: ['2023-09-01 00-00-00'] }];

      runPythonProcess.mockResolvedValueOnce(JSON.stringify([...mockTcData, null]));

      const response = await request(app).get(`/tc/byID/${mockTcID}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{...mockTcData[0], minFrame: 0}]);
    });

    test('should return 400 if there is an error', async () => {
      const mockTcID = '1';
      runPythonProcess.mockRejectedValueOnce(new Error('Python error'));

      const response = await request(app).get(`/tc/byID/${mockTcID}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Python error');
    });
  });

  describe('GET /tc/track_dav/:tcID', () => {
    test('should return track dav data for a given tc ID', async () => {
      const mockTcID = '1';
      const mockData = { '1': { track: 'dav' } };

      fs.readFile.mockImplementation((filepath, encoding, callback) => {
        callback(null, JSON.stringify(mockData));
      });

      const response = await request(app).get(`/tc/track_dav/${mockTcID}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData[mockTcID]);
    });

    test('should return 400 if there is an error', async () => {
      const mockTcID = '1';

      fs.readFile.mockImplementation((filepath, encoding, callback) => {
        callback(new Error('File read error'));
      });

      const response = await request(app).get(`/tc/track_dav/${mockTcID}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe('File read error');
    });
  });

  describe('GET /tc/track_intensity/:tcID', () => {
    test('should return track intensity data for a given tc ID', async () => {
      const mockTcID = '1';
      const mockData = { '1': { intensity: 'high' } };

      fs.readFile.mockImplementation((filepath, encoding, callback) => {
        callback(null, JSON.stringify(mockData));
      });

      const response = await request(app).get(`/tc/track_intensity/${mockTcID}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData[mockTcID]);
    });

    test('should return 400 if there is an error', async () => {
      const mockTcID = '1';

      fs.readFile.mockImplementation((filepath, encoding, callback) => {
        callback(new Error('File read error'));
      });

      const response = await request(app).get(`/tc/track_intensity/${mockTcID}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe('File read error');
    });
  });

  describe('filterData function', () => {
    test('should filter and transform data correctly', () => {
      const mockData = [
        {
          id: '1',
          center: [[0, 0], [10, 10], [20, 20]],
          time: ['2023-08-31 23:59:59', '2023-09-01 00:00:00', '2023-09-01 01:00:00']
        },
        {
          id: '2',
          center: [[0, 0], [20, 20], [70, 70]],
          time: ['2023-09-01 00:00:00', '2023-09-01 01:00:00', '2023-09-01 02:00:00']
        }
      ];

      const expectedOutput = [
        {
          id: '1',
          center: [[10, 10], [20, 20]],
          time: ['2023-09-01 00:00:00', '2023-09-01 01:00:00'],
          minFrame: 0
        },
        {
          id: '2',
          center: [[0, 0], [20, 20]],
          time: ['2023-09-01 00:00:00', '2023-09-01 01:00:00'],
          minFrame: 0
        }
      ];

      const result = filterData(mockData);
      expect(result).toEqual(expectedOutput);
    });

    test('should return an empty array if no valid data is found', () => {
      const mockData = [
        {
          id: '1',
          center: [[70, 70], [80, 80], [90, 90]],
          time: ['2023-08-31 22:00:00', '2023-08-31 22:30:00', '2023-08-31 23:00:00']
        }
      ];

      const result = filterData(mockData);
      expect(result).toEqual([]);
    });
  });
});