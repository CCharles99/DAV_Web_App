import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

function CycloneList({ tcList }) {
  const navigate = useNavigate();

  const BASIN_COLORMAP = {
    'NA': 'red',
    'EP': 'yellow',
    'WP': 'green'
  }

  return (tcList.length > 0) ? (
    <div>
      {tcList.map(tc => (
        <div className='bookmark--container'>
          <button style={{ backgroundColor: BASIN_COLORMAP[tc.basin] }}
            onClick={() => {
              navigate(`/cyclone/${tc.id}/${tc.name}`)
            }}
          >{tc.name}</button>
        </div>
      ))}
    </div>
  ) :
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>;
}

export default CycloneList;