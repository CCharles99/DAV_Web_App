import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';


function Map({ map, setMapLoaded, viewBounds, lat, lng, zoom }) {
    const mapContainer = useRef(null);

    useEffect(() => {

        // initialise map
        if (map.current) return;
        map.current = new mapboxgl.Map({
            style: 'mapbox://styles/ccha0057/clzza1y1e005u01oe50t28thz',
            container: mapContainer.current,
            center: { lat: lat, lng: lng },
            zoom: zoom,
            projection: 'equirectangular',
            maxPitch: 0,
        });

        map.current.on('load', () => {

            // initialise Infrared layer
            map.current.addSource('IR', {
                'type': 'image',
                'coordinates': viewBounds
            }).addLayer({
                id: 'ir-layer',
                'slot': 'bottom',
                'type': 'raster',
                'source': 'IR',
                'paint': {
                    'raster-fade-duration': 0,
                    'raster-opacity': 0.7
                }
            });

            // initialise DAV layer
            map.current.addSource('DAV', {
                'type': 'image',
                'coordinates': viewBounds
            }).addLayer({
                id: 'dav-layer',
                'slot': 'bottom',
                'type': 'raster',
                'source': 'DAV',
                'paint': {
                    'raster-fade-duration': 0,
                    'raster-opacity': 0.6
                }
            });

            // updates state variables when map state changes

            map.current.on('click', (e) => {
                console.log(e.lngLat);
                console.log(map.current.getZoom())
            })

            // disable rotation & keyboard controls
            map.current.dragRotate.disable();
            map.current.touchZoomRotate.disableRotation();
            map.current.keyboard.disable();
            setMapLoaded(true);
        });
    }, []);



    return (
        <div className="map-container">
            <div ref={mapContainer} className="map" />
        </div>
    );
}

export default Map;