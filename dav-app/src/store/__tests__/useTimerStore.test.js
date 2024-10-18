import create from 'zustand';
import useTimerStore from '../useTimerStore';

describe('useTimerStore', () => {

  beforeEach(() => {
    useTimerStore.getState().snap(0);

  });

  test('should initialize with default values', () => {
    expect(useTimerStore.getState().frame).toBe(0);
    expect(useTimerStore.getState().isPlaying).toBe(false);
    expect(useTimerStore.getState().isBuffering).toBe(false);
    expect(useTimerStore.getState().maxFrame).toBe(0);
  });

  test('should start playing', () => {
    useTimerStore.getState().start();
    expect(useTimerStore.getState().isPlaying).toBe(true);
  });

  test('should stop playing', () => {
    useTimerStore.getState().start();
    useTimerStore.getState().stop();
    expect(useTimerStore.getState().isPlaying).toBe(false);
  });

  test('should snap to a specific frame', () => {
    useTimerStore.getState().snap(5);
    expect(useTimerStore.getState().frame).toBe(5);
  });

  test('should set max frame', () => {
    useTimerStore.getState().setMaxFrame(10);
    expect(useTimerStore.getState().maxFrame).toBe(10);
  });

  test('should increment frame', () => {
    useTimerStore.getState().setMaxFrame(10);
    useTimerStore.getState().increment();
    expect(useTimerStore.getState().frame).toBe(1);
  });

  test('should reset frame to 0 when incrementing past max frame', () => {
    useTimerStore.getState().setMaxFrame(2);
    useTimerStore.getState().increment();
    useTimerStore.getState().increment();
    expect(useTimerStore.getState().frame).toBe(0);
  });

  test('should set buffering state', () => {
    useTimerStore.getState().setBuffering(true);
    expect(useTimerStore.getState().isBuffering).toBe(true);
  });
});