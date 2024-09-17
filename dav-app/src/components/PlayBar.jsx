import React, { useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function PlayBar({ numFrames, frame, setFrame, isPlaying, setIsPlaying, time, imageLayersLoaded}) {

  const timer = useRef(null);

  const handleSlider = (event) => {
    setFrame(parseInt(event.target.value));
  } 
  
  const waitForLayers = () => {
    return new Promise((resolve) => {
      const wait = () => {
        if (imageLayersLoaded()) {
          resolve();
        } else {
          setTimeout(wait, 5);
          console.log('oop')
        }
      }
      wait();
    });
  }

  const togglePlay = () => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        if (imageLayersLoaded()) {
          setFrame((frame) => {
            return (frame < numFrames - 1) ? frame + 1 : 0;
          });
        } else {
          setIsPlaying(false);
          waitForLayers().then(() => {
            setIsPlaying(true);
          });
        }
      }, 100)
    } else {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    togglePlay();
  }, [isPlaying])

  useEffect(() => {
    return () => togglePlay()
  }, [])

  return (
    <div className='play-bar'>
      <Button style={{ backgroundColor: "purple" }} onClick={() => setIsPlaying(isPlaying => !isPlaying)}>Pause/Play</Button>
      <Form.Range value={frame} min={0} max={numFrames - 1} onChange={handleSlider} />
      <div style={{ backgroundColor: "white", width: "50px" }} >{time}</div>
    </div>
  )
}

export default PlayBar;