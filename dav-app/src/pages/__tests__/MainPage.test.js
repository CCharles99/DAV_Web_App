import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../MainPage';
import useTimerStore from '../../store/useTimerStore';
import useTcStore from '../../store/useTCStore';
import mapboxgl from 'mapbox-gl';

jest.mock('../../store/useTimerStore');
jest.mock('../../store/useTCStore');

jest.mock('mapbox-gl', () => ({
  Map: jest.fn()
}));

describe('MainPage', () => {
  const mockHandleSearch = jest.fn();
  const mockDate = '2023-10-01';
  const mockLat = 0;
  const mockLng = 0;
  const mockZoom = 2;
  const mockView = 'view-1';
  const mockViewBounds = [[-180, -90], [180, 90]];
  const mockMap = {
    on: jest.fn(),
    addSource: jest.fn(),
    getSource: jest.fn(),
    isSourceLoaded: jest.fn(),
    addLayer: jest.fn(),
    loadImage: jest.fn(),
    addImage: jest.fn(),
    getLayer: jest.fn(),
    getCanvas: jest.fn(() => ({
      style: {}
    })),
    setLayoutProperty: jest.fn(),
    setPaintProperty: jest.fn(),
    panTo: jest.fn(),
    easeTo: jest.fn(),
    getZoom: jest.fn(),
    dragRotate: {
      disable: jest.fn()
    },
    touchZoomRotate: {
      disableRotation: jest.fn()
    },
    keyboard: {
      disable: jest.fn()
    }
  };

  beforeEach(() => {
    useTimerStore.mockReturnValue({
      frame: 0,
      setMaxFrame: jest.fn(),
      stop: jest.fn(),
      snap: jest.fn(),
    });

    useTcStore.mockReturnValue({
      tcList: [],
      loading: false,
      fetchTcs: jest.fn(),
    });

    mapboxgl.Map.mockReturnValue(mockMap);
  });

  test('renders MainPage component', () => {
    render(
      <MemoryRouter>
        <MainPage
          handleSearch={mockHandleSearch}
          date={mockDate}
          lat={mockLat}
          lng={mockLng}
          zoom={mockZoom}
          view={mockView}
          viewBounds={mockViewBounds}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Toggle Layer')).toBeInTheDocument();
    expect(screen.getByText('Cyclones')).toBeInTheDocument();
  });
});