import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import ViewList from '../components/ViewList';
import BookmarkList from '../components/BookmarkList';
import LayerToggle from '../components/LayerToggle';
import PlayBar from '../components/PlayBar';
import CycloneList from '../components/CycloneList';

import viewData from '../data/ViewData.json';


function MainPage({ handleSearch, date, lat, lng, zoom, view, viewBounds, freeCam }) {
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected

  // const MAP_BOUNDS = [[-360, -40], [360, 40]]  // [[west, south],[east, north]]
  const NUM_FRAMES = 48;
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [centerZoomState, setCenterZoomState] = useState({ lat: lat, lng: lng, zoom: zoom });

  const [tcList, setTcList] = useState([]);

  const BASE_URL_IM = 'http://localhost:5000/image/';
  const IMAGE_PARAMS = `/${view.split('-')[0]}/${date.slice(5, 7)}/${date} ${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}-00`;
  // const TRACK_PARAMS = `/date/${date}`;

  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', () => {
      // map.current.setMaxBounds(MAP_BOUNDS);
      updateData();

      map.current.on('dragend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      });

      map.current.on('zoomend', () => {
        setCenterZoomState({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4), zoom: map.current.getZoom().toFixed(2) });
      });
    });
  }, [])

  useEffect(() => {
    handleSearch({ lng: centerZoomState.lng, lat: centerZoomState.lat, zoom: centerZoomState.zoom });
  }, [centerZoomState])

  useEffect(() => {
    if (!mapLoaded) return;
    if (isPlaying) { setIsPlaying(false) }
    updateData();
  }, [date]);

  useEffect(() => {
    if (mapLoaded) {
      setSourceImage('DAV');
      setSourceImage('IR');
      updateTcIconPositions(tcList);
    }
  }, [frame]);

  const updateData = () => {
    setTcList(() => []);
    axios.head(BASE_URL_IM + 'DAV' + IMAGE_PARAMS)
      .then(() => {
        map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
        map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
        map.current.setPaintProperty('tc-icon-layer', 'icon-opacity', 0);

        tcList.forEach(tc => {
          map.current.removeLayer(tc.id);
          map.current.removeSource(tc.name);
        });

        axios.get(`http://localhost:5000/tc/byDate/${date}`)
          .then(res => {
            let newTcList = res.data;
            setTcList(() => newTcList);
            newTcList.forEach(tc => {
              if (map.current.getSource(tc.name) === undefined) {
                map.current.addSource(tc.name, {
                  'type': 'image',
                  'coordinates': [[-180, 60], [180, 60], [180, -60], [-180, -60]],
                  'url': BASE_URL_IM + 'track' + `/id/${tc.name}_${tc.id}`
                }).addLayer({
                  id: tc.id,
                  'slot': 'middle',
                  'type': 'raster',
                  'source': tc.name,
                });
              } else {
                map.current.setPaintProperty(tc.id, 'raster-opacity', 1);
              }
            });
            setFrame(0);
            setSourceImage('DAV');
            setSourceImage('IR');
            updateTcIconPositions(newTcList);

            map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
            map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.7);
            map.current.setPaintProperty('tc-icon-layer', 'icon-opacity', 1);
          });
      })
      .catch(err => {
        console.log(err)
      });
  }

  const updateTcIconPositions = (tcList) => {
    if (tcList.length == 0) return;
    map.current.setLayoutProperty('tc-icon-layer', 'icon-rotate', frame * 360 / 24);
    map.current.getSource('tc-icon').setData({
      "type": "FeatureCollection",
      "features": tcList.filter(tc => (frame >= tc.minFrame) && (frame <= tc.maxFrame)).map(tc => {
        return {
          "id": tc.id,
          "type": "Feature",
          "properties": { "name": tc.name, "id": tc.id },
          "geometry": {
            "type": "Point",
            "coordinates": tc.center[frame - tc.minFrame]
          }
        }
      })
    });
  }

  const handleJump = () => {
    map.current.easeTo({ center: { lat: lat, lng: lng }, zoom: zoom, duration: 500 });
  }

  const setSourceImage = (sourceID) => {
    map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + IMAGE_PARAMS });
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
    } else {
      // disable zoom
      map.current.boxZoom.disable();
      map.current.doubleClickZoom.disable();
      map.current.scrollZoom.disable();
      map.current.touchZoomRotate.disable();
      // disable pan
      map.current.dragPan.disable();
    }
  }, [freeCam]);


  useEffect(() => {
    if (!mapLoaded) return;
    handleJump();
    if (freeCam) return;
    map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
    map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
    setTimeout(() => {
      setSourceImage('DAV');
      setSourceImage('IR');
      map.current.getSource('DAV').setCoordinates(viewBounds);
      map.current.getSource('IR').setCoordinates(viewBounds);
      map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
      map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.7);
    }, 300);
  }, [view, freeCam]);

  return (
    <body>
      <Map
        map={map}
        setMapLoaded={setMapLoaded}
        viewBounds={viewBounds}
        lat={lat}
        lng={lng}
        zoom={zoom}
      />
      <PlayBar numFrames={NUM_FRAMES} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} time={`${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}`} />
      <AccordianGroup defaultActiveKey={"3"} >
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
          />
        </AccordionItem>
        <AccordionItem
          eventKey="3"
          header="Cyclones"
        >
          <CycloneList
            tcList={tcList}
          />
        </AccordionItem>
      </AccordianGroup>
    </body>
  );
}

export default MainPage;