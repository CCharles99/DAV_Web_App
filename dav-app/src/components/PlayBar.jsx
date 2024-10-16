import React, { useEffect, useState } from "react";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import useTimerStore from '../store/useTimerStore.js';
import useDebounce from "../custom-hooks/useDebounce.jsx";

function PlayBar({ numFrames, imageLayersLoaded, time }) {
  const PLAY = <BsPlayCircle color='purple' size='40px' onClick={() => start()} aria-label="Play"/>
  const PAUSE = <BsPauseCircle size='40px' color="purple" onClick={() => stop()} aria-label="Pause"/>
  const [icon, setIcon] = useState(PLAY);
  const debouncedIcon = useDebounce(icon, 100);

  const { frame, isPlaying, isBuffering, start, stop, snap, increment, setMaxFrame, setBuffering } = useTimerStore();

  useEffect(() => {
    setMaxFrame(numFrames);
  }, [numFrames])

  useEffect(() => {
    let timer;
    if (isPlaying) {
      setIcon(PAUSE)
      timer = setInterval(() => {
        if (imageLayersLoaded()) {
          increment();
        } else {
          stop();
          setBuffering(true);
        }
      }, 300);
    } 

    return () => {
      setIcon(PLAY);
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, increment]);

  useEffect(() => {
    if (isBuffering) {
      waitForLayers().then(() => {
        start();
        setBuffering(false);
      })
    }
  },[isBuffering])

  const handleSlider = (event) => {
    snap(parseInt(event.target.value));
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


  return (
    <div className='play-bar'>
      <div className="play-icon-container">
        {debouncedIcon}
      </div>
      <input type="range" style={{ accentColor: "rgb(229, 0, 229)", flex: 1 }} value={frame} min={0} max={numFrames - 1} onChange={handleSlider} />
      <div className="time" >{(time) ? time : `${String(Math.floor(frame * 30 / 60)).padStart(2, '0')}:${String(frame * 30 % 60).padStart(2, '0')}`} (UTC)</div>
    </div>
  )
}

export default PlayBar;