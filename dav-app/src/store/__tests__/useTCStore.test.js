import { act } from 'react-dom/test-utils';
import create from 'zustand';
import axios from 'axios';
import useTcStore from '../useTCStore';
import { renderHook } from '@testing-library/react';
import { jest } from '@jest/globals';

jest.mock('axios');

describe('useTcStore', () => {
  let store;

  beforeEach(() => {
    store = renderHook(() => useTcStore()).result;
  });

  test('should initialize with default values', () => {
    expect(store.current.tcList).toEqual([]);
    expect(store.current.prevTcList).toEqual([]);
    expect(store.current.loading).toBe(false);
    expect(store.current.date).toBe("");
  });

  test('should set loading to true when fetchTcs is called', async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      await store.current.fetchTcs('2023-10-10');
    });

    expect(store.current.loading).toBe(false);
  });

  test('should update tcList and date when fetchTcs is successful', async () => {
    const mockData = [{ id: 1, name: 'Test TC' }];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
      await store.current.fetchTcs('2023-10-10');
    });

    expect(store.current.tcList).toEqual(mockData);
    expect(store.current.date).toBe('2023-10-10');
  });

  test('should handle errors in fetchTcs', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await act(async () => {
      await store.current.fetchTcs('2023-10-10');
    });

    expect(store.current.tcList).toEqual([]);
    expect(store.current.loading).toBe(false);
  });

  test('should update prevTcList when fetchTcs is called', async () => {
    const initialData = [{ id: 1, name: 'Initial TC' }];
    const newData = [{ id: 2, name: 'New TC' }];
    axios.get.mockResolvedValueOnce({ data: initialData });

    await act(async () => {
      await store.current.fetchTcs('2023-10-09');
    });

    axios.get.mockResolvedValueOnce({ data: newData });

    await act(async () => {
      await store.current.fetchTcs('2023-10-10');
    });

    expect(store.current.prevTcList).toEqual(initialData);
    expect(store.current.tcList).toEqual(newData);
  });
});