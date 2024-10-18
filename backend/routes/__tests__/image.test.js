const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { imgRouter } = require('../image');
const runPythonProcess = require('../../runPythonProcess');

jest.mock('fs');
jest.mock('../../runPythonProcess');

const app = express();
app.use(express.json());
app.use('/images', imgRouter);

describe('Image Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /images/:type/:view/:name/:datetime', () => {
    test('should return image data', async () => {
      const imagePath = path.join(__dirname, '../../images/type/view/name/datetime.png');
      const imageData = Buffer.from('image data');
      fs.readFile.mockImplementation((filePath, callback) => {
        if (filePath === imagePath) {
          callback(null, imageData);
        } else {
          callback(new Error('File not found'));
        }
      });

      const response = await request(app).get('/images/type/view/name/datetime');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(imageData);
    });

    test('should return 404 if image not found', async () => {
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(new Error('File not found'));
      });

      const response = await request(app).get('/images/type/view/name/datetime');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /images/track/id/:tcIDName', () => {
    test('should return image data', async () => {
      const imagePath = path.join(__dirname, '../../images/TRACKS/TC/tcIDName.png');
      const imageData = Buffer.from('image data');
      fs.readFile.mockImplementation((filePath, callback) => {
        if (filePath === imagePath) {
          callback(null, imageData);
        } else {
          callback(new Error('File not found'));
        }
      });

      const response = await request(app).get('/images/track/id/tcIDName');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(imageData);
    });

    test('should return 404 if image not found', async () => {
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(new Error('File not found'));
      });

      const response = await request(app).get('/images/track/id/tcIDName');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /images/track/date/:date', () => {
    test('should run python process and return output', async () => {
      runPythonProcess.mockResolvedValue('Python script output');

      const response = await request(app)
        .post('/images/track/date/2023-10-01')
        .send({ tcList: ['tc1', 'tc2'] });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Python script output');
    });

    test('should return 400 if python process fails', async () => {
      runPythonProcess.mockRejectedValue(new Error('Python script error'));

      const response = await request(app)
        .post('/images/track/date/2023-10-01')
        .send({ tcList: ['tc1', 'tc2'] });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Python script error');
    });
  });

  describe('GET /images/track/date/:date', () => {
    test('should return image data', async () => {
      const imagePath = path.join(__dirname, '../../images/Tracks/DATE/2023-10-01.png');
      const imageData = Buffer.from('image data');
      fs.readFile.mockImplementation((filePath, callback) => {
        if (filePath === imagePath) {
          callback(null, imageData);
        } else {
          callback(new Error('File not found'));
        }
      });

      const response = await request(app).get('/images/track/date/2023-10-01');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(imageData);
    });

    test('should return 404 if image not found', async () => {
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(new Error('File not found'));
      });

      const response = await request(app).get('/images/track/date/2023-10-01');
      expect(response.status).toBe(404);
    });
  });
});