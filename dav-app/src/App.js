import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import TestPage from './components/TestPage';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';


function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(144.9);
  const [lat, setLat] = useState(-37.8);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      projection: 'mercator',
      maxBounds: [[-180, -90], [180, 90]]
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
