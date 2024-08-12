import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Map from '../components/Map';
import ViewList from '../components/ViewList';
import BookmarkList from '../components/BookmarkList';
import LayerToggle from '../components/LayerToggle';

import viewData from '../data/ViewData.json';

// axios.get(`http://localhost:5000/tc/byID/13196`)
//   .then(res => console.log(res.data));

// axios.get(`http://localhost:5000/tc/byDate/2022-09-23`)
//   .then(res => console.log(res.data));


function MainPage({ handleSearch, date, lat, lng, zoom, view, viewBounds, freeCam }) {
  const map = useRef(null);
  const mapLoaded = useRef(false); // map.loaded() doesn't work as expected

  const MAP_BOUNDS = [[-360, -40], [360, 40]]  // [[west, south],[east, north]]

  const timer = useRef(null);
  const [frame, setFrame] = useState(0);

  const [centerZoomState, setCenterZoomState] = useState({ lat: lat, lng: lng, zoom: zoom });

  const BASE_URL_IM = 'http://localhost:5000/image/';
  const URL_PARAMS = `/${view.split('-')[0]}/${date.slice(5, 7)}/${date} ${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}-00`;

  const togglePlay = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    } else {
      timer.current = setInterval(() => {
        setFrame((frame) => {
          return (frame >= 47) ? 0 : frame + 1;
        });
      }, 100)
    }
  }

  useEffect(() => {
    handleSearch({ lng: centerZoomState.lng, lat: centerZoomState.lat, zoom: centerZoomState.zoom });
  }, [centerZoomState])

  useEffect(() => {
    if (!mapLoaded.current) return;
    if (timer.current) { togglePlay() }
    axios.head(BASE_URL_IM + 'DAV' + URL_PARAMS)
      .then(() => {
        map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
        map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
        setTimeout(() => {
          setFrame(0);
          togglePlay();
          setSourceImage('DAV');
          setSourceImage('IR');
          map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
          map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);
        }, 500);
      })
      .catch(err => {
        console.log(err, 'ehe')
      });
  }, [date]);


  const handleJump = () => {
    map.current.easeTo({ center: { lat: lat, lng: lng }, zoom: zoom, duration: 500 });
  }

  const setSourceImage = (sourceID) => {
    map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + URL_PARAMS });
  }

  const toggleVisibility = (layerID, showLayer) => {
    map.current.setLayoutProperty(layerID, 'visibility', showLayer ? 'visible' : 'none');
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
      setSourceImage('DAV');
      setSourceImage('IR');
      map.current.getSource('DAV').setCoordinates(viewBounds);
      map.current.getSource('IR').setCoordinates(viewBounds);
      map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
      map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);
    }, 300);
  }, [view]);

  return (
    <body>
      <Map
        map={map}
        mapLoaded={mapLoaded}
        MAP_BOUNDS={MAP_BOUNDS}
        viewBounds={viewBounds}
        lat={lat}
        lng={lng}
        zoom={zoom}
        setCenterZoomState={setCenterZoomState}
        setSourceImage={setSourceImage}
      />
      <div className='play-bar'>
        <Button style={{ backgroundColor: "purple" }} onClick={togglePlay}>Pause/Play</Button>
        <Form.Range value={frame} min={0} max={47} onChange={handleSlider} />
      </div>
      <AccordianGroup
      />
      <AccordianGroup defaultActiveKeys={["0", "1", "2"]} >
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
            view={view}
            date={date} />
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
          />
        </AccordionItem>
      </AccordianGroup>
    </body>
  );
}

export default MainPage;