import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import ViewList from '../components/ViewList';
import BookmarkList from '../components/BookmarkList';
import LayerToggle from '../components/LayerToggle';

import viewData from '../data/ViewData.json';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';

function MainPage({ handleSearch, date, lat, lng, zoom, view, viewBounds, freeCam }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapLoaded = useRef(false); // map.loaded() doesn't work as expected
  const [centerZoomState, setCenterZoomState] = useState({ lat: lat, lng: lng, zoom: zoom });

  const MAP_BOUNDS = [[-360, -40], [360, 40]]  // [[west, south],[east, north]]

  const timer = useRef(null);
  const [frame, setFrame] = useState(1);

  const BASE_URL = 'http://localhost:5000/image/';
  const URL_PARAMS = `/${view.split('-')[0]}/${date} ${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}-00`;

  const togglePlay = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    } else {
      timer.current = setInterval(() => {
        setFrame((frame) => {
          return (frame >= 48) ? 1 : frame + 1;
        });
      }, 100)
    }
  }

  useEffect(() => {
    // axios.get(`http://localhost:5000/tc/byID/13196`)
    //   .then(res => console.log(res.data));

    // axios.get(`http://localhost:5000/tc/byDate/2022-09-23`)
    //   .then(res => console.log(res.data));

    // initialise map
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: { lat: lat, lng: lng },
      zoom: zoom,
      projection: 'equirectangular',
      maxPitch: 0,
      maxBounds: MAP_BOUNDS,
    });

    map.current.on('load', () => {
      console.log(viewBounds)

      // initialise Infrared layer
      map.current.addSource('IR', {
        'type': 'image',
        'url': BASE_URL + 'IR' + URL_PARAMS,
        'coordinates': viewBounds
      }
      ).addLayer({
        id: 'ir-layer',
        'type': 'raster',
        'source': 'IR',
        'paint': { 'raster-fade-duration': 0 }
      }
      ).setPaintProperty('ir-layer', 'raster-opacity', 0.9);

      // initialise DAV layer
      map.current.addSource('DAV', {
        'type': 'image',
        'url': BASE_URL + 'DAV' + URL_PARAMS,
        'coordinates': viewBounds
      }
      ).addLayer({
        id: 'dav-layer',
        'type': 'raster',
        'source': 'DAV',
        'paint': { 'raster-fade-duration': 0 }
      }
      ).setPaintProperty('dav-layer', 'raster-opacity', 0.5);

      // start animation
      togglePlay();

      // updates state variables when map state changes
      map.current.on('dragend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      });

      map.current.on('zoomend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      })

      map.current.on('click', (e) => {
        console.log(e.lngLat);
      })

      // disable rotation & keyboard controls
      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();
      map.current.keyboard.disable();

      mapLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    handleSearch({ lng: centerZoomState.lng, lat: centerZoomState.lat, zoom: centerZoomState.zoom });
  }, [centerZoomState])

  useEffect(() => {
    if (timer.current) { togglePlay() }
    // show modal with spinner and determine if the selected date has images.
  }, [date]);


  const handleJump = () => {
    map.current.easeTo({ center: { lat: lat, lng: lng }, zoom: zoom, duration: 500 });
  }

  const setSourceImage = (sourceID) => {
    map.current.getSource(sourceID).updateImage({ url: BASE_URL + sourceID + URL_PARAMS });
  }

  const toggleVisibility = (layerID, showLayer) => {
    let visibility = ''
    visibility = showLayer ? 'visible' : 'none'
    map.current.setLayoutProperty(layerID, 'visibility', visibility);
  }
  
  useEffect(() => {
    if (freeCam) {
      // enable zoom
      map.current.boxZoom.enable();
      map.current.doubleClickZoom.enable();
      map.current.scrollZoom.enable();
      map.current.touchZoomRotate.enable();
      map.current.touchZoomRotate.disableRotation();
      // enable pan
      map.current.dragPan.enable();
      map.current.setMaxBounds(MAP_BOUNDS);
    } else {
      // disable zoom
      map.current.boxZoom.disable();
      map.current.doubleClickZoom.disable();
      map.current.scrollZoom.disable();
      map.current.touchZoomRotate.disable();
      // disable pan
      map.current.dragPan.disable();

      map.current.setMaxBounds();
    }
  }, [freeCam]);

  const handleSlider = (event) => {
    setFrame(parseInt(event.target.value));
  }

  useEffect(() => {
    if (!mapLoaded.current) return;
    map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
    map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
    handleJump()
    setTimeout(() => {
      map.current.getSource('DAV').setCoordinates(viewBounds);
      map.current.getSource('IR').setCoordinates(viewBounds);
      map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
      map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);
    }, 300);
  }, [view]);

  return (
    <body>
      <div className="map-container">
        <div ref={mapContainer} className="map" />
      </div>
      <div className='play-bar'>
        <Button style={{ backgroundColor: "purple" }} onClick={togglePlay}>Pause/Play</Button>
        <Form.Range value={frame} min={1} max={48} onChange={handleSlider} />
      </div>
      <AccordianGroup
      />
      <AccordianGroup
        defaultActiveKeys={["0", "1", "2"]}
      >
        <AccordionItem
          eventKey="0"
          header="Views"
        >
          <ViewList
            handleSearch={handleSearch}
            viewData={viewData}
          />
        </AccordionItem>
        <AccordionItem
          eventKey="1"
          header="Bookmarks"
        >
          <BookmarkList
            handleSearch={handleSearch}
            lng={lng}
            lat={lat}
            zoom={zoom}
            view={view} />
        </AccordionItem>
        <AccordionItem
          eventKey="2"
          header="Toggle Layer"
        >
          <LayerToggle
            mapLoaded={mapLoaded}
            toggleVisibility={toggleVisibility}
            setSourceImage={setSourceImage}
            frame={frame}
            view={view}
          />
        </AccordionItem>
      </AccordianGroup>
    </body>
  );
}

export default MainPage;