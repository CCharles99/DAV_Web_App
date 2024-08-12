import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';


function Map({ map, mapLoaded, MAP_BOUNDS, viewBounds, lat, lng, zoom, setSourceImage, setCenterZoomState }) {
    const mapContainer = useRef(null);

    useEffect(() => {

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
                'coordinates': viewBounds
            }
            ).addLayer({
                id: 'dav-layer',
                'type': 'raster',
                'source': 'DAV',
                'paint': { 'raster-fade-duration': 0 }
            }
            ).setPaintProperty('dav-layer', 'raster-opacity', 0.5);

            setSourceImage('DAV');
            setSourceImage('IR');

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



    return (
        <div className="map-container">
            <div ref={mapContainer} className="map" />
        </div>
    );
}

export default Map;