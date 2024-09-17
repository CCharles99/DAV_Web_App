import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import LayerToggleGroup from '../components/LayerToggleGroup';
import PlayBar from '../components/PlayBar';
import TCInfoCard from '../components/TCInfoCard';
import LineGraph from "../components/LineGraph";
import Spinner from "react-bootstrap/Spinner";

function CyclonePage() {
    const map = useRef();
    const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected

    const { tcID, tcName } = useParams(); // 13200, IAN
    const [tcData, setTcData] = useState();
    const [centerDAV, setCenterDAV] = useState();
    const [centerIntensity, setCenterIntensity] = useState();

    const ZOOM = 4.4;
    const [datetime, setDatetime] = useState();

    const [frame, setFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const BASE_URL_IM = 'http://localhost:5000/image/';
    const IMAGE_PARAMS = `/TC/${tcName}_${tcID}/${datetime}`;
    // const TRACK_PARAMS = `/id/${tcName}_${tcID}`;

    useEffect(() => {
        axios.get(`http://localhost:5000/tc/byID/${JSON.stringify([tcID.toString()])}`)
            .then(res => {
                let newTcData = res.data[0]
                setTcData(() => newTcData);
                setDatetime(() => newTcData.time[0]);
            });

        axios.get(`http://localhost:5000/tc/track_dav/${tcID}`)
            .then(res => {
                setCenterDAV(() => res.data);
            });

        axios.get(`http://localhost:5000/tc/track_intensity/${tcID}`)
            .then(res => {
                setCenterIntensity(() => res.data);
            });

    }, []);

    useEffect(() => {
        if (!mapLoaded) return;
        if (map.current.getSource(tcName) === undefined) {
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
        }

        setSourceImage('DAV', IMAGE_PARAMS);
        setSourceImage('IR', IMAGE_PARAMS);
        updateBoundaries();
    }, [mapLoaded])

    useEffect(() => {
        if (!mapLoaded) return;
        updateBoundaries();
    }, [frame]);

    const imageLayersLoaded = () => {
        return (map.current.isSourceLoaded('DAV') && map.current.isSourceLoaded('IR'));
    }

    const updateBoundaries = () => {

        map.current.setCenter(tcData.center[frame]);
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
            <PlayBar imageLayersLoaded={imageLayersLoaded} numFrames={tcData ? tcData.time.length : 0} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} time={datetime?.slice(11, 16)} />
            <AccordianGroup
            />
            <AccordianGroup defaultActiveKey={"0"} >
                <AccordionItem
                    eventKey="0"
                    header="Toggle Layers"
                >
                    <LayerToggleGroup
                        mapLoaded={mapLoaded}
                        toggleVisibility={toggleVisibility}
                        layerIDLists={[['dav-layer'], ['ir-layer'], [tcID]]}
                        labels={['Show DAV', 'Show IR', 'Show Track']}
                    />
                </AccordionItem>
            </AccordianGroup>
            <TCInfoCard tcData={tcData} tcName={tcName} frame={frame}>
                {(centerDAV) && (tcData) ?
                    <LineGraph centerDAV={centerDAV} centerIntensity={centerIntensity} frame={frame} />
                    :
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
            </TCInfoCard>
        </body>
    );
}

export default CyclonePage;