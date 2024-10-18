import { Card, Image } from 'react-bootstrap';
import IRColorbar from '../assets/IRColorbar.png';
import DAVColorbar from '../assets/DAVColorbar.png';
import TrackColorbar from '../assets/TrackColorbar.png';
import React from 'react';
const Legend = React.memo(() => {

  return (
    <div className='legend-container'>

      <Card data-bs-theme="dark" >
        <Card.Body style={{paddingTop: '12px'}}>
          <Card.Title className='text-center'>Legend</Card.Title>
          <div className='colorbar-container'>
            <Image height='226px' src={DAVColorbar} />
            <Image height='226px' src={IRColorbar} />
            <Image height='226px' src={TrackColorbar} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
});

export default Legend;