import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CycloneList({ date }) {
  const [tcList, setTcList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTcList(null);
    axios.get(`http://localhost:5000/tc/byDate/${date}`)
      .then(res => setTcList(res.data));
  }, [date])
  return tcList ? (
    <div>
      {Object.entries(tcList).map(tc => (
        <div className='bookmark--container'>
          <button
            onClick={() => {
              let tcName = tc[0]
              let tcID = tc[1]
              navigate(`/cyclone/${tcID}/${tcName}`)
            }}
          >{tc[0]}</button>
        </div>
      ))}
    </div>
  ) : <></>;
}

export default CycloneList;