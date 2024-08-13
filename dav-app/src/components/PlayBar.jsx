import React, { useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function PlayBar({num_frames, frame, setFrame, isPlaying, setIsPlaying}) {

  const timer = useRef(null);

  const handleSlider = (event) => {
    setFrame(parseInt(event.target.value));
  }

  const togglePlay = () => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setFrame((frame) => {
          return (frame < num_frames - 1) ? frame + 1 : 0;
        });
      }, 50)
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
      <Form.Range value={frame} min={0} max={num_frames-1} onChange={handleSlider} />
    </div>
  )
}

export default PlayBar;