import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import ViewList from '../components/ViewList';
import BookmarkList from '../components/BookmarkList';
import LayerToggle from '../components/LayerToggle';
import PlayBar from '../components/PlayBar';

import viewData from '../data/ViewData.json';


function MainPage({ handleSearch, date, lat, lng, zoom, view, viewBounds, freeCam }) {
  const map = useRef(null);
  const mapLoaded = useRef(false); // map.loaded() doesn't work as expected

  const MAP_BOUNDS = [[-360, -40], [360, 40]]  // [[west, south],[east, north]]
  const NUM_FRAMES = 48;
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [centerZoomState, setCenterZoomState] = useState({ lat: lat, lng: lng, zoom: zoom });

  const BASE_URL_IM = 'http://localhost:5000/image/';
  const URL_PARAMS = `/${view.split('-')[0]}/${date.slice(5, 7)}/${date} ${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}-00`;

  useEffect(() => {
    axios.get(`http://localhost:5000/tc/byDate/${date}`)
      .then(res => console.log(res.data));

    map.current.on('load', () => {
      map.current.setMaxBounds(MAP_BOUNDS);
      setSourceImage('DAV');
      setSourceImage('IR');

      map.current.on('dragend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      });

      map.current.on('zoomend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      })
    })
  }, [])

  useEffect(() => {
    handleSearch({ lng: centerZoomState.lng, lat: centerZoomState.lat, zoom: centerZoomState.zoom });
  }, [centerZoomState])

  useEffect(() => {
    if (!mapLoaded.current) return;
    if (isPlaying) { setIsPlaying(false) }
    axios.head(BASE_URL_IM + 'DAV' + URL_PARAMS)
      .then(() => {
        map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
        map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
        setTimeout(() => {
          setFrame(0);
          setIsPlaying(true);
          setSourceImage('DAV');
          setSourceImage('IR');
          map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
          map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);
        }, 500);
      })
      .catch(err => {
        console.log(err)
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
        viewBounds={viewBounds}
        lat={lat}
        lng={lng}
        zoom={zoom}
      />
      <PlayBar num_frames={NUM_FRAMES} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
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