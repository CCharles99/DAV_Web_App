import { useLoaderData, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import LayerToggle from '../components/LayerToggle';
import PlayBar from '../components/PlayBar';

function CyclonePage({ setDate }) {
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected

    const { tcID, tcName } = useParams(); // 13200, IAN
    const [tcData, setTcData] = useState(null);
    const ZOOM = 4.4;
    const [datetime, setDatetime] = useState();

    const [frame, setFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const BASE_URL_IM = 'http://localhost:5000/image/';
    const IMAGE_PARAMS = `/TC/${tcName}_${tcID}/${datetime}`;
    const TRACK_PARAMS = `/id/${tcName}_${tcID}`;

    useEffect(() => {
        axios.get(`http://localhost:5000/tc/byID/${JSON.stringify([tcID.toString()])}`)
            .then(res => {
                let newTcData = res.data[0]
                setTcData(newTcData);
                setDatetime(newTcData.time[0]);
                console.log(newTcData)
            });

        axios.get(`http://localhost:5000/tc/track_dav/${tcID}`)
            .then(res => {
                console.log(res.data)
            });
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;

        map.current.addSource(tcName, {
            'type': 'image',
            'coordinates': [[-180, 60], [180, 60], [180, -60], [-180, -60]],
            'url': BASE_URL_IM + 'track' + `/id/${tcName}_${tcID}`
        }).addLayer({
            id: tcID,
            'slot': 'middle',
            'type': 'raster',
            'source': tcName,
        });

        setSourceImage('DAV', IMAGE_PARAMS);
        setSourceImage('IR', IMAGE_PARAMS);
        updateBoundaries();
    }, [mapLoaded])

    useEffect(() => {
        if (!mapLoaded) return;
        updateBoundaries();
    }, [frame]);

    const updateBoundaries = () => {

        map.current.setCenter(tcData.center[frame]);
        // setDate(tcData.time[frame].slice(0, 10))
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

    useEffect(() => {
        if (mapLoaded) {
            setSourceImage('DAV');
            setSourceImage('IR');
        }
    }, [frame]);

    const setSourceImage = (sourceID) => {
        map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + IMAGE_PARAMS });
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
            /> : <></>}
            <PlayBar numFrames={tcData ? tcData.time.length : 0} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} time={datetime?.slice(11, 16)} />
            <AccordianGroup
            />
            <AccordianGroup defaultActiveKey={"0"} >
                <AccordionItem
                    eventKey="0"
                    header="Toggle Layers"
                >
                    <LayerToggle
                        mapLoaded={mapLoaded}
                        toggleVisibility={toggleVisibility}
                    />
                </AccordionItem>
            </AccordianGroup>
        </body>
    );
}

export default CyclonePage;