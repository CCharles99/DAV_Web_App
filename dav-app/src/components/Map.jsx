import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import "../custom.css";


function Map(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [center, setCenter] = useState({lng: -74, lat: 41});
    const [zoom, setZoom] = useState(3);
    const [play, setPlay] = useState(true);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            center: center,
            zoom: zoom,
            projection: 'equirectangular',
            bearingSnap: 180,
            maxPitch: 0,
            maxBounds: [
                [-180, -70], // [west, south]
                [180, 70]
            ]
        });

        const corners = [
            [-182.921, 62.5],
            [182.921, 62.5],
            [182.921, -62.5],
            [-182.921, -62.5]
        ];

        const cornersLarge = [
            [-180.7, 60.55],
            [180.7, 60.55],
            [180.7, -60.55],
            [-180.7, -60.55]
        ]

        map.current.on('load', () => {
            map.current.addSource('ir', {
                'type': 'image',
                'url': `http://localhost:5000/image/IR/2022-09-23/1`,
                'coordinates': corners
            });

            map.current.addLayer({
                id: 'ir-layer',
                'type': 'raster',
                'source': 'ir',
                'paint': { 'raster-fade-duration': 0 }
            });

            map.current.setPaintProperty('ir-layer', 'raster-opacity', 0.9);

            map.current.addSource('dav', {
                'type': 'image',
                'url': `http://localhost:5000/image/DAV/2022-09-23/1`,
                'coordinates': corners
            });

            map.current.addLayer({
                id: 'dav-layer',
                'type': 'raster',
                'source': 'dav',
                'paint': { 'raster-fade-duration': 0 }
            });

            map.current.setPaintProperty('dav-layer', 'raster-opacity', 0.5);

            let i = 2;
            const timer = setInterval(() => {
                if (play) {
                    map.current.getSource('dav').updateImage({ url: `http://localhost:5000/image/DAV/2022-09-23/${i}` });
                    map.current.getSource('ir').updateImage({ url: `http://localhost:5000/image/IR/2022-09-23/${i}` });
                    i++
                    if (i > 48) { i = 1 }
                }
            }, 100)
        });
    });

    function togglePlay() {
        setPlay(!play);
    }


    return (
        <>
            <div className="map-container">
                <div ref={mapContainer} className="map" />
            </div>
        </>

    );
}

export default Map;