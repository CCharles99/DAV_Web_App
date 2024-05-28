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
  const [lng, setLng] = useState(-74);
  const [lat, setLat] = useState(41);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      projection: 'equirectangular',
      bearingSnap: 180,
      maxPitch: 0,
      maxBounds: [
        [-180, -70], // [west, south]
        [180, 70] 
      ],
    });
    const corners = [
      [-182.921, 62.5],
      [182.921, 62.5],
      [182.921, -62.5],
      [-182.921, -62.5]
    ];

    const cornersLarge = [
      [-180.7, 60.55],
      [180.7, 60.55],
      [180.7, -60.55],
      [-180.7, -60.55]
    ]

    map.current.on('load', () => {
      map.current.addSource('ir', {
        'type': 'image',
        'url': `http://localhost:5000/image/IR/2022-09-23/1`,
        'coordinates': corners
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
        'url': `http://localhost:5000/image/DAV/2022-09-23/1`,
        'coordinates': corners
      });

      map.current.addLayer({
        id: 'dav-layer',
        'type': 'raster',
        'source': 'dav',
        'paint': { 'raster-fade-duration': 0 }
      });

      map.current.setPaintProperty('dav-layer','raster-opacity',0.5);

      let i = 2;
      const timer = setInterval(() => {
        if (i < 49) {
          map.current.getSource('dav').updateImage({ url: `http://localhost:5000/image/DAV/2022-09-23/${i}`});
          map.current.getSource('ir').updateImage({ url: `http://localhost:5000/image/IR/2022-09-23/${i}`});
          console.log(map.current.getSource('dav').url)
          i++
        } else {
          i = 1;
        }
      }, 100)
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
