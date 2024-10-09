import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import tcIcon from '../assets/tc_icon.png'
import tcIconMirror from '../assets/tc_icon_mirror.png'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


function Map({ map, setMapLoaded }) {
    const mapContainer = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {

        // initialise map
        if (map.current) return;
        map.current = new mapboxgl.Map({
            style: 'mapbox://styles/ccha0057/clzza1y1e005u01oe50t28thz',
            container: mapContainer.current,
            center: { lat: 0, lng: 0 },
            zoom: 1.58,
            maxBounds: [[-360, -60], [360, 60]],  // [[west, south],[east, north]]
            projection: 'equirectangular',
            maxPitch: 0,
        });

        map.current.on('load', () => {

            // initialise Infrared layer
            map.current.addSource('IR', {
                'type': 'image',
                'coordinates': [
                    [-1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1]
                ]
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
                'coordinates': [
                    [-1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1]
                ]
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

            // initialise Northern Hemisphere Icon layer
            map.current.loadImage(tcIcon,
                (error, image) => {
                    if (error) throw error;

                    // Add the image to the map style.
                    map.current.addImage('tcn-icon', image, { sdf: true });

                    map.current.addSource('tcn-icon', {
                        'type': 'geojson',
                        'data': {
                            type: 'FeatureCollection',
                            features: []
                        }
                    }).addLayer({
                        'id': 'tcn-icon-layer',
                        'type': 'symbol',
                        'source': 'tcn-icon',
                        'layout': {
                            'icon-image': 'tcn-icon',
                            'icon-size': 0.25,
                            'icon-allow-overlap': true,
                        }
                    });
                });

            // initialise Southern Hemisphere Icon layer
            map.current.loadImage(tcIconMirror,
                (error, image) => {
                    if (error) throw error;

                    // Add the image to the map style.
                    map.current.addImage('tcs-icon', image, { sdf: true });

                    map.current.addSource('tcs-icon', {
                        'type': 'geojson',
                        'data': {
                            type: 'FeatureCollection',
                            features: []
                        }
                    }).addLayer({
                        'id': 'tcs-icon-layer',
                        'type': 'symbol',
                        'source': 'tcs-icon',
                        'layout': {
                            'icon-image': 'tcs-icon',
                            'icon-size': 0.25,
                            'icon-allow-overlap': true,
                        }
                    });
                });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.current.on('mouseenter', ['tcn-icon-layer', 'tcs-icon-layer'], (e) => {
                // Change the cursor style as a UI indicator.
                map.current.getCanvas().style.cursor = 'pointer';

                // Copy coordinates array.
                const coordinates = e.features[0].geometry.coordinates.slice();
                const tcName = e.features[0].properties.name;


                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }


                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(tcName).addTo(map.current);
            });

            map.current.on('click', ['tcn-icon-layer', 'tcs-icon-layer'], (e) => {
                const tcName = e.features[0].properties.name;
                const tcID = e.features[0].properties.id;

                navigate(`/cyclone/${tcID}/${tcName}`)
            });

            map.current.on('mouseleave', ['tcn-icon-layer', 'tcs-icon-layer'], () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.current.on('click', (e) => {
                console.log(e.lngLat);
                console.log(map.current.getZoom())
            });

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