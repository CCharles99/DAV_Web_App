import { useLoaderData, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import LayerToggle from '../components/LayerToggle';
import PlayBar from '../components/PlayBar';

/**
 * to fill the screen would be 26 east/west, 12 north/south
 */

function CyclonePage({ setDate }) {
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected

    const { tcID, tcName } = useParams(); // 13200, IAN
    const [tcData, setTcData] = useState();
    const ZOOM = 4.4;
    const [datetime, setDatetime] = useState();

    const [frame, setFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const BASE_URL_IM = 'http://localhost:5000/image/';
    const URL_PARAMS = `/TC/${tcName}_${tcID}/${datetime}`;

    useEffect(() => {
        axios.get(`http://localhost:5000/tc/byID/${tcID}`)
            .then(res => {
                console.log(res.data);
                // strip times of unusable values
                let minValidIndex = res.data.time.findIndex(datetime => datetime.substring(5, 7) === '09');
                let maxValidTimeIndex = res.data.time.findLastIndex(datetime => datetime.substring(5, 7) === '09');
                // strip lats of unusable values
                let maxValidLatIndex = res.data.center.findLastIndex(center => (Math.abs(center[1]) < 60));
                let maxValidIndex = Math.min(maxValidTimeIndex, maxValidLatIndex);
                setTcData({
                    center: res.data.center.slice(minValidIndex, maxValidIndex),
                    time: res.data.time.slice(minValidIndex, maxValidIndex),
                    numFrames: maxValidIndex - minValidIndex
                });
                setDatetime(res.data.time[minValidIndex]);

            });
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;
        if (map.current.getSource('tcPath') != undefined) return;

        map.current.addSource('tcPath', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'MultiLineString',
                    'coordinates': [tcData.center, [[0, 0], [60, 60]]]
                }
            }
        }).addLayer({
            id: 'tcPath-layer',
            'slot': 'middle',
            'type': 'line',
            'source': 'tcPath',
            'layout': {
                'line-join': 'round',
            },
            'paint': {
                'line-dasharray': [1, 2],
                'line-color': 'purple',
                'line-width': 4
            }
        });
        setSourceImage('DAV');
        setSourceImage('IR');
        updateStuff();
        console.log(URL_PARAMS);
    }, [mapLoaded])

    useEffect(() => {
        if (!mapLoaded) return;
        updateStuff();
    }, [frame]);

    const updateStuff = () => {

        map.current.setCenter(tcData.center[frame]);
        setDate(tcData.time[frame].slice(0, 10))
        setDatetime(tcData.time[frame]);
        let center = tcData.center[frame];
        let north = (center[1] <= 50) ? center[1] + 10 : 60;
        let south = (center[1] >= -50) ? center[1] - 10 : -60;
        let west = center[0] - 10;
        let east = center[0] + 10;

        let DAVViewBounds = [
            [west, north],
            [east, north],
            [east, south],
            [west, south]
        ];

        center = tcData.center[frame];
        north = (center[1] <= 49) ? center[1] + 11 : 60;
        south = (center[1] >= -49) ? center[1] - 11 : -60;
        west = center[0] - 26;
        east = center[0] + 26;

        let IRViewBounds = [
            [west, north],
            [east, north],
            [east, south],
            [west, south]
        ];
        map.current.getSource('DAV').setCoordinates(DAVViewBounds);
        map.current.getSource('IR').setCoordinates(IRViewBounds);
    }

    const setSourceImage = (sourceID) => {
        map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + URL_PARAMS });
    }

    const toggleVisibility = (layerID, showLayer) => {
        map.current.setLayoutProperty(layerID, 'visibility', showLayer ? 'visible' : 'none');
    }

    return (
        <body>
            {(tcData) ? <Map
                map={map}
                setMapLoaded={setMapLoaded}
                viewBounds={[
                    [-1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1]
                ]}
                lat={0}
                lng={0}
                zoom={ZOOM}
            /> : ' '}
            <PlayBar numFrames={tcData?.numFrames} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} time={datetime?.slice(11, 16)} />
            <AccordianGroup
            />
            <AccordianGroup defaultActiveKeys={["0"]} >
                <AccordionItem
                    eventKey="0"
                    header="Toggle Layers"
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

export default CyclonePage;