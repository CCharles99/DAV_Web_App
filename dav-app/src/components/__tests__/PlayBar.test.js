import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayBar from '../PlayBar';
import useTimerStore from '../../store/useTimerStore';
import useDebounce from '../../custom-hooks/useDebounce';

// Mock the custom hooks
jest.mock('../../store/useTimerStore');
jest.mock('../../custom-hooks/useDebounce');

describe('PlayBar Component', () => {
  const mockStart = jest.fn();
  const mockStop = jest.fn();
  const mockSnap = jest.fn();
  const mockIncrement = jest.fn();
  const mockSetMaxFrame = jest.fn();
  const mockSetBuffering = jest.fn();
  const mockImageLayersLoaded = jest.fn();

  beforeEach(() => {
    useTimerStore.mockReturnValue({
      frame: 0,
      isPlaying: false,
      isBuffering: false,
      start: mockStart,
      stop: mockStop,
      snap: mockSnap,
      increment: mockIncrement,
      setMaxFrame: mockSetMaxFrame,
      setBuffering: mockSetBuffering,
    });

    useDebounce.mockImplementation((value) => value);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PlayBar component', () => {
    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('00:00 (UTC)')).toBeInTheDocument();
  });

  test('play button starts the timer', () => {
    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    expect(mockStart).toHaveBeenCalled();
  });

  test('pause button stops the timer', () => {
    useTimerStore.mockReturnValue({
      frame: 0,
      isPlaying: true,
      isBuffering: false,
      start: mockStart,
      stop: mockStop,
      snap: mockSnap,
      increment: mockIncrement,
      setMaxFrame: mockSetMaxFrame,
      setBuffering: mockSetBuffering,
    });

    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    const pauseButton = screen.getByLabelText('Pause');
    fireEvent.click(pauseButton);
    expect(mockStop).toHaveBeenCalled();
  });

  test('slider changes frame', () => {
    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '50' } });
    expect(mockSnap).toHaveBeenCalledWith(50);
  });

  test('sets max frame on mount', () => {
    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    expect(mockSetMaxFrame).toHaveBeenCalledWith(100);
  });

  test('handles buffering state', async () => {
    useTimerStore.mockReturnValue({
      frame: 0,
      isPlaying: false,
      isBuffering: true,
      start: mockStart,
      stop: mockStop,
      snap: mockSnap,
      increment: mockIncrement,
      setMaxFrame: mockSetMaxFrame,
      setBuffering: mockSetBuffering,
    });

    mockImageLayersLoaded.mockReturnValue(true);

    render(<PlayBar numFrames={100} imageLayersLoaded={mockImageLayersLoaded} time="00:00" />);
    await waitFor(() => {
      expect(mockStart).toHaveBeenCalled();
      expect(mockSetBuffering).toHaveBeenCalledWith(false);
    });
  });
});