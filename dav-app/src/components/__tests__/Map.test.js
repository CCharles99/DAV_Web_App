import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Map from '../Map';
import mapboxgl from 'mapbox-gl';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(),
  Popup: jest.fn()
}));

describe('Map Component', () => {
  let map;
  let setMapLoaded;
  const mockPopup = {
    setLngLat: jest.fn(),
    setHTML: jest.fn(),
    addTo: jest.fn(),
    remove: jest.fn()
  };
  const mockMap = {
    on: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    loadImage: jest.fn(),
    addImage: jest.fn(),
    getCanvas: jest.fn(() => ({
      style: {}
    })),
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
    map = { current: null };
    setMapLoaded = jest.fn();
    mapboxgl.Map.mockReturnValue(mockMap);
  });

  test('renders map container', () => {
    render(
      <Router>
        <Map map={map} setMapLoaded={setMapLoaded} />
      </Router>
    );
    const mapElement = screen.getByLabelText('Map');
    expect(mapElement).toBeInTheDocument();
  });

  test('initializes map on first render', () => {
    render(
      <Router>
        <Map map={map} setMapLoaded={setMapLoaded} />
      </Router>
    );
    expect(mapboxgl.Map).toHaveBeenCalledTimes(1);
  });

  test('does not reinitialize map on subsequent renders', () => {
    map.current = {};
    render(
      <Router>
        <Map map={map} setMapLoaded={setMapLoaded} />
      </Router>
    );
    expect(mapboxgl.Map).not.toHaveBeenCalled();
  });

  test('sets map loaded state on map load', () => {
    mockMap.addSource.mockReturnValueOnce(mockMap);
    mockMap.addSource.mockReturnValueOnce(mockMap);
    render(
      <Router>
        <Map map={map} setMapLoaded={setMapLoaded} />
      </Router>
    );
    
    const mapInstance = mapboxgl.Map.mock.results[0].value;
    const loadCallback = mapInstance.on.mock.calls.find(call => call[0] === 'load')[1];
    loadCallback();
    expect(setMapLoaded).toHaveBeenCalledWith(true);
  });

  test('adds sources and layers on map load', () => {
    mockMap.addSource.mockReturnValueOnce(mockMap);
    mockMap.addSource.mockReturnValueOnce(mockMap);
    render(
      <Router>
        <Map map={map} setMapLoaded={setMapLoaded} />
      </Router>
    );
    const mapInstance = mapboxgl.Map.mock.results[0].value;
    const loadCallback = mapInstance.on.mock.calls.find(call => call[0] === 'load')[1];
    loadCallback();
    expect(mapInstance.loadImage).toHaveBeenCalledTimes(2);
    expect(mapInstance.addSource).toHaveBeenCalledTimes(2);
    expect(mapInstance.addLayer).toHaveBeenCalledTimes(2);
  });
});