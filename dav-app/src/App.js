import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl'; 
import TestPage from './components/TestPage';
import axios from 'axios';
mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';
const interpolateHeatmapLayer = require('interpolateheatmaplayer');

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      projection: 'equirectangular',
      maxBounds: [[-110, -9], [110, 9]], // why???
    });

    map.current.on('load', () => {
      map.current.addSource('ir', {
        'type': 'image',
        'url': 'http://localhost:5000/test/ir',
        'coordinates': [
          [-182.921, 63],
          [182.921, 63],
          [182.921, -63],
          [-182.921, -63]
        ]
      });

      map.current.addLayer({
        id: 'ir-layer',
        'type': 'raster',
        'source': 'ir',
        'paint': { 'raster-fade-duration': 0 }
      });

      map.current.setPaintProperty('ir-layer','raster-opacity',0.9);

      map.current.addSource('dav', {
        'type': 'image',
        'url': 'http://localhost:5000/test/dav',
        'coordinates': [
          [-182.921, 63],
          [182.921, 63],
          [182.921, -63],
          [-182.921, -63]
        ]
      });

      map.current.addLayer({
        id: 'dav-layer',
        'type': 'raster',
        'source': 'dav',
        'paint': { 'raster-fade-duration': 0 }
      });

      map.current.setPaintProperty('dav-layer','raster-opacity',0.5);
    });
  });
  
  return (
    <Router>
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
      <Routes>
        <Route path="/testpage" element = {<TestPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
