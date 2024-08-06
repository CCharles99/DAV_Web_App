import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import AccordianGroup from '../components/AccordionGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';

import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';

function MainPage() {

    let { date } = useParams();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [center, setCenter] = useState({ lng: -74, lat: 0 });
    const [zoom, setZoom] = useState(2.37);
    const [view, setView] = useState({symbol: 'WORLD', bounds: [[-182.921, 62.5], [182.921, 62.5], [182.921, -62.5], [-182.921, -62.5]]});
    const mapLoaded = useRef(false); // map.loaded() doesn't work as expected

    const MAP_BOUNDS = [[-100.0, -40], [100.0, 40]]  // [[west, south],[east, north]

    const timer = useRef(null);
    const [frame, setFrame] = useState(1);


    const BASE_URL_DAV = 'http://localhost:5000/image/DAV';
    const BASE_URL_IR = 'http://localhost:5000/image/IR';
    const URL_PARAMS = `/${view.symbol}/${date}/${frame}`;

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
        axios.get(`http://localhost:5000/test/py`)
            .then(res => console.log(res));

        // initialise map
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            center: center,
            zoom: zoom,
            projection: 'equirectangular',
            maxPitch: 0,
            maxBounds: MAP_BOUNDS
        });

        map.current.on('load', () => {
            // initialise Infrared layer
            map.current.addSource('ir', {
                'type': 'image',
                'url': BASE_URL_IR + URL_PARAMS,
                'coordinates': view.bounds
            }
            ).addLayer({
                id: 'ir-layer',
                'type': 'raster',
                'source': 'ir',
                'paint': { 'raster-fade-duration': 0 }
            }
            ).setPaintProperty('ir-layer', 'raster-opacity', 0.9);

            // initialise DAV layer
            map.current.addSource('dav', {
                'type': 'image',
                'url': BASE_URL_DAV + URL_PARAMS,
                'coordinates': view.bounds
            }
            ).addLayer({
                id: 'dav-layer',
                'type': 'raster',
                'source': 'dav',
                'paint': { 'raster-fade-duration': 0 }
            }
            ).setPaintProperty('dav-layer', 'raster-opacity', 0.5);

            // start animation
            togglePlay();

            // updates state variables when map state changes
            map.current.on('dragend', () => {
                setCenter({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4) });
            });

            map.current.on('zoomend', () => {
                setCenter({ lng: map.current.getCenter().lng.toFixed(4), lat: map.current.getCenter().lat.toFixed(4) });
                setZoom(map.current.getZoom().toFixed(2));
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
        if (timer.current) { togglePlay() }
        // show modal with spinner and determine if the selected date has images.
    }, [date]);

    useEffect(() => {
        if (mapLoaded.current) {
            map.current.getSource('dav').updateImage({ url: BASE_URL_DAV + URL_PARAMS });
            map.current.getSource('ir').updateImage({ url: BASE_URL_IR + URL_PARAMS });
        }
    }, [frame, view]);

    const handleJump = (center, zoom) => {
        map.current.easeTo({center: center, zoom: zoom, duration: 500});
    }

    const handleMapConstraints = (isFree) => {
        if (map.current.dragPan.isEnabled() === isFree) return; // already in selected mode 
        if (isFree) {
            // enable zoom
            map.current.boxZoom.enable();
            map.current.doubleClickZoom.enable();
            map.current.scrollZoom.enable();
            map.current.touchZoomRotate.enable();
            map.current.touchZoomRotate.disableRotation();
            // enable pan
            map.current.dragPan.enable();
            setZoom(2.37);
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
    }

    const handleSlider = (event) => {
        setFrame(parseInt(event.target.value));
    }

    const handleView = (selectedView) => {
        if (view.symbol === selectedView.symbol) return; // selected view is already loaded
        map.current.setPaintProperty('dav-layer', 'raster-opacity', 0);
        map.current.setPaintProperty('ir-layer', 'raster-opacity', 0);
        setTimeout(() => {
            setView(selectedView);
            map.current.getSource('dav').setCoordinates(selectedView.bounds);
            map.current.getSource('ir').setCoordinates(selectedView.bounds);
            map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);
            map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);
        }, 300)
    }

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
                setFreeCam={handleMapConstraints}
                handleJump={handleJump}
                handleView={handleView}
                center={center}
                zoom={zoom}
                view={view}
            />
        </body>
    );
}

export default MainPage;