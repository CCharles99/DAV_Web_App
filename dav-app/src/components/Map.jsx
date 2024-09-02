import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import tcIcon from '../assets/tc_icon.png'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2NoYTAwNTciLCJhIjoiY2swOWZ5ODVwMDhjYTNjbnljN3Z5MXI4ayJ9._ibGMEIebSWPwmIEbUHc6A';


function Map({ map, setMapLoaded, viewBounds, lat, lng, zoom }) {
    const mapContainer = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {

        // initialise map
        if (map.current) return;
        map.current = new mapboxgl.Map({
            style: 'mapbox://styles/ccha0057/clzza1y1e005u01oe50t28thz',
            container: mapContainer.current,
            center: { lat: lat, lng: lng },
            zoom: zoom,
            maxBounds: [[-360, -60], [360, 60]],  // [[west, south],[east, north]]
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

            // initialise Icon layer
            map.current.loadImage(tcIcon,
                (error, image) => {
                    if (error) throw error;

                    // Add the image to the map style.
                    map.current.addImage('tc-icon', image, { sdf: true });

                    map.current.addSource('tc-icon', {
                        'type': 'geojson',
                        'data': {
                            type: 'FeatureCollection',
                            features: []
                        }
                    }).addLayer({
                        'id': 'tc-icon-layer',
                        'type': 'symbol',
                        'source': 'tc-icon',
                        'layout': {
                            'icon-image': 'tc-icon',
                            'icon-size': 0.25,
                            'icon-allow-overlap': true,
                        },
                        'paint': {
                            'icon-color': 'black'
                            // 'icon-color': [
                            //     'match', ['get', 'basin'],
                            //     'NA', 'red',
                            //     'EP', 'yellow',
                            //     'WP', 'green',
                            //     'black'
                            // ],
                        }
                    });
                });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.current.on('mouseenter', 'tc-icon-layer', (e) => {
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

            map.current.on('click', 'tc-icon-layer', (e) => {
                const tcName = e.features[0].properties.name;
                const tcID = e.features[0].properties.id;

                navigate(`/cyclone/${tcID}/${tcName}`)
            });

            map.current.on('mouseleave', 'tc-icon-layer', () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });

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