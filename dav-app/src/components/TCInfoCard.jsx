import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "../custom.css";


function TCInfoCard({ children, tcData, tcName, frame }) {

  const dateFormat = (date) => {
    date = new Date(date);
    return date.toDateString();
  }
  
  return (
    <div className='tcinfocard-container'>

      <Card data-bs-theme="dark">
        <Card.Body>
          <Card.Title className='text-center'>Tropical Cyclone {tcName}</Card.Title>
          <Card.Subtitle className='text-center'>DAV vs Time</Card.Subtitle>
          {children}
          <ListGroup variant="flush">
            <ListGroup.Item>Date: {dateFormat(tcData?.time[frame].slice(0, 11))}</ListGroup.Item>
            <ListGroup.Item>Latitude: {tcData?.center[frame][1].toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>Longitude: {tcData?.center[frame][0].toFixed(2)}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TCInfoCard;