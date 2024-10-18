import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccordionItem.jsx';
import axios from 'axios';
import Map from '../components/Map';
import LayerToggleGroup from '../components/LayerToggleGroup';
import PlayBar from '../components/PlayBar';
import TCInfoCard from '../components/TCInfoCard';
import LineGraph from "../components/LineGraph";
import Spinner from "react-bootstrap/Spinner";
import useTimerStore from '../store/useTimerStore.js';
import Legend from '../components/Legend.jsx'

function CyclonePage() {
    const [error, setError] = useState({ message: '', status: false });
    const map = useRef();
    const [mapLoaded, setMapLoaded] = useState(false); // map.loaded() doesn't work as expected

    const { tcID, tcName } = useParams(); // 13200, IAN
    const [tcData, setTcData] = useState();
    const [centerDAV, setCenterDAV] = useState();
    const [centerIntensity, setCenterIntensity] = useState();

    const ZOOM = 4.4;

    const { frame, stop, snap } = useTimerStore();
    // const [datetime, setDatetime] = useState();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const BASE_URL_IM = BASE_URL + 'image/';

    const getData = async () => {
        console.log(tcName, tcID);
        let tcData;
        try {
            let res = await axios.get(`${BASE_URL}tc/byID/${JSON.stringify([tcID.toString()])}`)
            tcData = res.data[0];
            if (tcData.name !== tcName) {
                setError({ message: `TC ID does not match TC Name. Expected pair: (${tcID}, ${tcData.name})`, status: true });
                return;
            }
            setTcData(() => tcData);
        } catch (error) {
            setError({ message: `TC ID does not exist: ${tcID}`, status: true });
            return;
        }

        await axios.get(`${BASE_URL}tc/track_dav/${tcID}`)
            .then(res => {
                setCenterDAV(() => res.data);
            });

        await axios.get(`${BASE_URL}tc/track_intensity/${tcID}`)
            .then(res => {
                setCenterIntensity(() => res.data);

            });
        return tcData;
    }

    const waitForMap = () => {
        return new Promise((resolve) => {
            const wait = () => {
                if (map.current?.loaded()) {
                    resolve();
                } else {
                    setTimeout(wait, 100);
                }
            }
            wait();
        });
    }

    const waitForLayer = (layerID) => {
        return new Promise((resolve) => {
            const wait = async () => {
                let layer
                try {
                    layer = await map.current.getLayer(layerID)
                } catch (error) {
                    console.log(error)
                }
                if (layer) {
                    resolve();
                } else {
                    setTimeout(wait, 5);
                    console.log('oop')
                }
            }
            wait();
        });
    }

    useEffect(() => {
        getData().then((tcData) => {
            waitForMap().then(() => {
                map.current.setZoom(ZOOM);
                let trackSource = map.current.getSource('tcTrack')
                if (trackSource) {
                    trackSource.updateImage({ url: BASE_URL_IM + 'track' + `/id/${tcName}_${tcID}` })
                } else {
                    map.current.addSource('tcTrack', {
                        'type': 'image',
                        'coordinates': [[-180, 60], [180, 60], [180, -60], [-180, -60]],
                        'url': BASE_URL_IM + 'track' + `/id/${tcName}_${tcID}`
                    }).addLayer({
                        id: 'tc-track',
                        'slot': 'middle',
                        'type': 'raster',
                        'source': 'tcTrack',
                    });
                }
                setSourceImage('DAV', tcData.time[frame]);
                setSourceImage('IR', tcData.time[frame]);
                updateBoundaries(tcData);
                snap(0);
            });
        });
        return () => {
            stop();
        }
    }, [tcID])

    useEffect(() => {
        return () => {
            snap(0);
        }
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;
        setSourceImage('DAV', tcData.time[frame]);
        setSourceImage('IR', tcData.time[frame]);
        updateBoundaries(tcData);
    }, [frame]);

    const imageLayersLoaded = () => {
        return (map.current.isSourceLoaded('DAV') && map.current.isSourceLoaded('IR'));
    }

    const updateBoundaries = (tcData) => {

        map.current.setCenter(tcData.center[frame]);
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

    const setSourceImage = (sourceID, datetime) => {
        map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + `/TC/${tcName}_${tcID}/${datetime}` });
    }

    const toggleVisibility = (layerID, showLayer) => {
        map.current.setLayoutProperty(layerID, 'visibility', showLayer ? 'visible' : 'none');
    }

    return (
        <div className="page">
            {error.status ? <h1>{error.message}</h1> : (
                <>

                    {(tcData)
                        ? <Map map={map} setMapLoaded={setMapLoaded} />
                        : <></>
                    }
                    <PlayBar imageLayersLoaded={imageLayersLoaded} numFrames={tcData ? tcData.time.length : 0} time={tcData?.time[frame].slice(11, 16)} />
                    <AccordianGroup
                    />
                    <AccordianGroup defaultActiveKey={"0"} >
                        <AccordionItem
                            eventKey="0"
                            header="Toggle Layers"
                        >
                            <LayerToggleGroup
                                waitForLayer={waitForLayer}
                                mapLoaded={mapLoaded}
                                toggleVisibility={toggleVisibility}
                                layerIDLists={[['dav-layer'], ['ir-layer'], ['tc-track']]}
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
                    <Legend />
                </>
            )}
        </div>
    );
}

export default CyclonePage;