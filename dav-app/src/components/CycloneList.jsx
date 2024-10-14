import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, ListGroup, ListGroupItem } from 'react-bootstrap';

function CycloneList({ tcList }) {
  const BASINS = { 'NI': 'North Indian', 'SI': 'South Indian', 'EP': 'Eastern Pacific', 'WP': 'Western Pacific', 'SP': 'South Pacific', 'NA': 'North Atlantic', 'SA': 'South Atlantic' };
  const navigate = useNavigate();

  // restructure data first
  // if no data, dont show the basin

  const groupByBasin = (tcList) => {
    let basinMap = {};
    tcList.forEach(tc => {
      if (!basinMap[tc.basin]) {
        basinMap[tc.basin] = [];
      }
      basinMap[tc.basin].push(tc)
    });
    return basinMap;

    // return tcList.filter(tc => tc.basin === basin).map(tc => (
    //   <ListGroupItem
    //     action
    //     style={{ paddingTop: '6px', paddingBottom: '6px', borderRadius: '5px' }}
    //     onClick={() => navigate(`/cyclone/${tc.id}/${tc.name}`)}
    //   >
    //     {tc.name.charAt(0) + tc.name.slice(1).toLowerCase()}
    //   </ListGroupItem>
    // ));
  }
  const tcBasinMap = groupByBasin(tcList);


  return (tcList.length > 0) ? (
    <ListGroup variant='flush' style={{maxHeight: "350px", scrollbarWidth: 'thin', overflowX: 'auto' }}>
      {Object.keys(tcBasinMap).map(basin => {
        let basinTcList = tcBasinMap[basin];
        return (
          <ListGroupItem
            style={{ fontWeight: 'bold', paddingTop: '6px', paddingBottom: '6px'}}
          >
            {BASINS[basin]}
            <ListGroup variant='flush'>
              {basinTcList.map(tc => (
                <ListGroupItem
                    action
                    style={{ paddingTop: '6px', paddingBottom: '6px'}}
                    onClick={() => navigate(`/cyclone/${tc.id}/${tc.name}`)}
                  >
                    {tc.name.charAt(0) + tc.name.slice(1).toLowerCase()}
                  </ListGroupItem>
              ))}
            </ListGroup>
          </ListGroupItem>

        )
      })}
    </ListGroup>
  ) :
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Spinner animation="border" role="status" />
    </div>
}

export default CycloneList;