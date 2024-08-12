import React, { useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function PlayBar({NUM_FRAMES, frame, setFrame, isPlaying, setIsPlaying}) {

  const timer = useRef(null);

  const handleSlider = (event) => {
    setFrame(parseInt(event.target.value));
  }

  const togglePlay = () => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setFrame((frame) => {
          return (frame < NUM_FRAMES - 1) ? frame + 1 : 0;
        });
      }, 100)
    } else {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    togglePlay();
  }, [isPlaying])

  return (
    <div className='play-bar'>
      <Button style={{ backgroundColor: "purple" }} onClick={() => setIsPlaying(isPlaying => !isPlaying)}>Pause/Play</Button>
      <Form.Range value={frame} min={0} max={NUM_FRAMES-1} onChange={handleSlider} />
    </div>
  )
}

export default PlayBar;