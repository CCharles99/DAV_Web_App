import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccordionItem.jsx';
import Map from '../components/Map';
import ViewList from '../components/ViewList';
import BookmarkList from '../components/BookmarkList';
import PlayBar from '../components/PlayBar';
import CycloneList from '../components/CycloneList';
import useTimerStore from '../store/useTimerStore.js';
import Legend from '../components/Legend.jsx';
import viewData from '../data/ViewData.json';
import LayerToggleGroup from '../components/LayerToggleGroup';
import useTcStore from '../store/useTCStore.js';


function MainPage({ handleSearch, date, lat, lng, zoom, view, viewBounds }) {
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected
  const firstRender = useRef(true);
  const { frame, stop, snap } = useTimerStore();
  const { tcList, loading, fetchTcs } = useTcStore();

  // const MAP_BOUNDS = [[-360, -40], [360, 40]]  // [[west, south],[east, north]]
  const NUM_FRAMES = 48;

  const [bookmark, setBookmark] = useState(null);

  const [centerZoomState, setCenterZoomState] = useState({ lat: lat, lng: lng, zoom: zoom });

  const BASE_URL_IM = process.env.REACT_APP_BASE_URL + 'image/';
  const IMAGE_PARAMS = `/${view.split('-')[0]}/${date.slice(5, 7)}/${date} ${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}-${String(frame * 30 % 60).padStart(2, '0')}-00`;

  useEffect(() => {
    console.log(date, lat, lng, zoom, view, viewBounds)
  }, [])
  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', () => {

      map.current.on('dragend', (e) => {
        let center = e.target.getCenter();
        let zoom = e.target.getZoom();
        setCenterZoomState({ lng: center.lng, lat: center.lat, zoom: zoom, originalEvent: e.originalEvent });
      });

      map.current.on('zoomend', (e) => {
        let center = e.target.getCenter();
        let zoom = e.target.getZoom();
        setCenterZoomState({ lng: center.lng, lat: center.lat, zoom: zoom, originalEvent: e.originalEvent });

      });
    });

    return () => {
      stop();
    }
  }, [])

  useEffect(() => {
    handleSearch({ lng: centerZoomState.lng, lat: centerZoomState.lat, zoom: centerZoomState.zoom, view: (centerZoomState.originalEvent) ? `${view.split('-')[0]}-a` : view });
  }, [centerZoomState])

  useEffect(() => {
    if (!mapLoaded) return;
    setSourceImage('DAV');
    setSourceImage('IR');
    fetchTcs(date);

    return () => {
      stop();
      snap(0);
    }
  }, [date, mapLoaded]);

  const toggleVisibility = (layerID, showLayer) => {
    map.current.setLayoutProperty(layerID, 'visibility', showLayer ? 'visible' : 'none');
  }

  const setSourceImage = (sourceID) => {
    try {
      map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + IMAGE_PARAMS });
    } catch (err) {
      console.log(err)
    }
  }

  const imageLayersLoaded = () => {
    return (map.current.isSourceLoaded('DAV') && map.current.isSourceLoaded('IR'));
  }

  useEffect(() => {
    if (!mapLoaded) return;
    if (firstRender.current) {
      firstRender.current = false;
    } else if (view.endsWith('-a')) {
      return;
    } 
    map.current.panTo({ lat: lat, lng: lng }, { duration: 500 });
    map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
    map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
    setTimeout(() => {
      setSourceImage('DAV');
      setSourceImage('IR');
    }, 150)
    setTimeout(() => {
      map.current.getSource('DAV').setCoordinates(viewBounds);
      map.current.getSource('IR').setCoordinates(viewBounds);
      map.current.easeTo({ zoom: zoom, duration: 500 });
    }, 500);
    setTimeout(() => {
      map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
      map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.7);
    }, 800);
  }, [view, mapLoaded, bookmark]);

  useEffect(() => {
    if (!mapLoaded) return;
    setSourceImage('DAV');
    setSourceImage('IR');
    updateTcIconPositions(tcList);
  }, [frame]);


  const updateTcIconPositions = async (tcList) => {

    // filter out tcs that don't have data for the current frame
    tcList = tcList.filter(tc => (frame >= tc.minFrame) && (frame <= tc.maxFrame))

    const setTcSourceData = (source, list) => {
      map.current.getSource(source).setData({
        "type": "FeatureCollection",
        "features": list.map(tc => {
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

    // update northern hemisphere icons
    const northTcList = tcList.filter(tc => ["NI", "EP", "WP", "NA"].some((basin) => basin === tc.basin))
    setTcSourceData('tcn-icon', northTcList);
    map.current.setLayoutProperty('tcn-icon-layer', 'icon-rotate', -frame * 360 / 24);

    // update southern hemisphere icons
    const southTcList = tcList.filter(tc => ["SI", "SP", "SA"].some((basin) => basin === tc.basin));
    setTcSourceData('tcs-icon', southTcList);
    map.current.setLayoutProperty('tcs-icon-layer', 'icon-rotate', frame * 360 / 24);
  }

  useEffect(() => {
    if (loading) return;
    if (!map.current.getLayer('tcn-icon-layer')) return;
    if (!map.current.getLayer('tcs-icon-layer')) return;

    updateTcIconPositions(tcList);

    tcList.forEach(tc => {
      map.current.addSource(tc.name, {
        'type': 'image',
        'coordinates': [[-180, 60], [180, 60], [180, -60], [-180, -60]],
        'url': process.env.REACT_APP_BASE_URL + `image/track/id/${tc.name}_${tc.id}`
      }).addLayer({
        id: tc.id,
        'slot': 'middle',
        'type': 'raster',
        'source': tc.name,
        'paint': {
          'raster-fade-duration': 0,
        }
      });
    });
    map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.6);
    map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.7);
    map.current.setPaintProperty('tcn-icon-layer', 'icon-opacity', 1);
    map.current.setPaintProperty('tcs-icon-layer', 'icon-opacity', 1);

    return () => {
      tcList.forEach(tc => {
        map.current.removeLayer(tc.id);
        map.current.removeSource(tc.name);
      });

      map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
      map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
      map.current.setPaintProperty('tcn-icon-layer', 'icon-opacity', 0);
      map.current.setPaintProperty('tcs-icon-layer', 'icon-opacity', 0);
    }

  }, [tcList, loading])

  return (
    <div className='page'>
      <Map
        map={map}
        setMapLoaded={setMapLoaded}
      />
      <PlayBar imageLayersLoaded={imageLayersLoaded} numFrames={NUM_FRAMES} />
      <AccordianGroup defaultActiveKey={"3"} >
        <AccordionItem
          eventKey="0"
          header="Views"
        >
          <ViewList
            handleSearch={handleSearch}
            viewData={viewData}
            currentView={view.split('-')[0]}
          />
        </AccordionItem>
        <AccordionItem
          eventKey="1"
          header="Bookmarks"
        >
          <BookmarkList
            setBookmark={setBookmark}
            handleSearch={handleSearch}
            lng={lng}
            lat={lat}
            zoom={zoom}
            view={view}
            date={date}
          />
        </AccordionItem>
        <AccordionItem
          eventKey="2"
          header="Toggle Layer"
        >
          <LayerToggleGroup
            mapLoaded={mapLoaded}
            toggleVisibility={toggleVisibility}
            layerIDLists={[['dav-layer'], ['ir-layer'], ['tcs-icon-layer', 'tcn-icon-layer'], tcList.map(tc => tc.id)]}
            labels={['Show DAV', 'Show IR', 'Show Icons', 'Show Tracks']}
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
      <Legend/>
    </div>
  );
}

export default MainPage;