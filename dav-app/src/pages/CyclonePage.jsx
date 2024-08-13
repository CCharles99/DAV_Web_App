import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import AccordianGroup from '../components/AccordionGroup';
import AccordionItem from '../components/AccodionItem';
import axios from 'axios';
import Map from '../components/Map';
import LayerToggle from '../components/LayerToggle';
import PlayBar from '../components/PlayBar';

/**
 * MAYBE USE A LOADER
 * accessed by searching for a cyclone, clicking a list item or clicking a cyclone icon
 * centered view of cyclone
 *  - 
 * layer toggle, play bar for whole lifetime.
 * return button to previous page
 */

function CyclonePage() {
    const map = useRef(null);
    const mapLoaded = useRef(false); // map.loaded() doesn't work as expected

    const { tcID, tcName } = useParams(); // 13200, IAN
    const tcData = useRef();
    const ZOOM = 4.4;
    const [datetime, setDatetime] = useState();

    const num_frames = useRef();
    const [frame, setFrame] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const BASE_URL_IM = 'http://localhost:5000/image/';
    const URL_PARAMS = `/TC/${tcName}_${tcID}/${datetime}`;
    
    useEffect(() => {
        axios.get(`http://localhost:5000/tc/byID/${tcID}`)
            .then(res => {
                // strip times of unusable values
                let minValidIndex = res.data.time.findIndex(datetime => datetime.substring(5, 7) === '09');
                let maxValidTimeIndex = res.data.time.findLastIndex(datetime => datetime.substring(5, 7) === '09');
                // strip lats of unusable values
                let maxValidLatIndex = res.data.lat.findLastIndex(lat => (Math.abs(lat) < 60));
                let maxValidIndex = Math.min(maxValidTimeIndex, maxValidLatIndex);
                tcData.current = {
                    lng: res.data.lng.slice(minValidIndex,maxValidIndex),
                    lat: res.data.lat.slice(minValidIndex,maxValidIndex),
                    time: res.data.time.slice(minValidIndex,maxValidIndex),
                };
                num_frames.current = maxValidIndex - minValidIndex;
                setDatetime(tcData.current.time[0]);
                setFrame(0);
            });
        map.current.on('load', () => {
            // disable zoom
            map.current.boxZoom.disable();
            map.current.doubleClickZoom.disable();
            map.current.scrollZoom.disable();
            map.current.touchZoomRotate.disable();
            // disable pan
            map.current.dragPan.disable();
        });
    },[]);

    useEffect(() => {
        if(!mapLoaded.current) return;
        map.current.setCenter({lng: tcData.current.lng[frame], lat:tcData.current.lat[frame]});
        setDatetime(tcData.current.time[frame]);
        let north = (tcData.current.lat[frame] <= 50) ? tcData.current.lat[frame]+10 : 60;
        let south = (tcData.current.lat[frame] >= -50) ? tcData.current.lat[frame]-10 : -60;
        let west = tcData.current.lng[frame]-10;
        let east = tcData.current.lng[frame]+10;

        let viewBounds = [
            [west, north],
            [east, north], 
            [east, south], 
            [west, south]
        ];
        map.current.getSource('DAV').setCoordinates(viewBounds);
        map.current.getSource('IR').setCoordinates(viewBounds);
    }, [frame]);

    const setSourceImage = (sourceID) => {
        map.current.getSource(sourceID).updateImage({ url: BASE_URL_IM + sourceID + URL_PARAMS });
      }
    
      const toggleVisibility = (layerID, showLayer) => {
        map.current.setLayoutProperty(layerID, 'visibility', showLayer ? 'visible' : 'none');
      }

    return (
        <body>
            <Map
                map={map}
                mapLoaded={mapLoaded}
                viewBounds={[
                    [-1, 1],
                    [1, 1], 
                    [1, -1], 
                    [-1, -1]
                ]}
                lat={0}
                lng={0}
                zoom={ZOOM}
            />
            <PlayBar num_frames={num_frames.current} frame={frame} setFrame={setFrame} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
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