import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { useEffect, useState } from 'react';


function TCInfoCard({ children, tcData, tcName, frame }) {

  const [localTime, setLocalTime] = useState();
  const [UTCTime, setUTCTime] = useState();
  const latitude = tcData?.center[frame][1].toFixed(2)
  const longitude = tcData?.center[frame][0].toFixed(2)
  const dateFormat = (date) => {
    date = new Date(date);
    return date.toDateString();
  }

  // const getLocalTime = async () => {
  //   return axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=JQN427FYAF29&format=json&by=position&lat=${40.730610}&lng=${-73.935242}`)
  //     .then((res) => {
  //       console.log(res.data)
  //       return {
  //         datetime: UTCTime?.getTime() - res.data.gmtOffset * 1000,
  //         abbr: res.data.abbreviation
  //       }
  //     })

  // }

  // useEffect(() => {
  //   setUTCTime(new Date(tcData?.time[frame].replace(/ (\d{2})-(\d{2})-(\d{2})/, " $1:$2:$3") + ' UTC'));
  //   setLocalTime(getLocalTime());
  // }, []);


  // useEffect(() => {
  //   setUTCTime(new Date(tcData?.time[frame].replace(/ (\d{2})-(\d{2})-(\d{2})/, " $1:$2:$3") + ' UTC'));
  //   if (frame % 10 === 0 && tcData) {
  //   } 
  // }, [frame])

  return (
    <div className='tcinfocard-container'>

      <Card data-bs-theme="dark">
        <Card.Body>
          <Card.Title className='text-center'>Tropical Cyclone {tcName}</Card.Title>
          {children}
          <ListGroup variant="flush">
            <ListGroup.Item>Date: {dateFormat(tcData?.time[frame].slice(0, 11))}</ListGroup.Item>
            <ListGroup.Item>Latitude: {latitude < 0 ? 'S' : 'N'} {Math.abs(latitude)}, Longitude: {longitude < 0 ? 'W' : 'E'} {Math.abs(longitude)}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TCInfoCard;