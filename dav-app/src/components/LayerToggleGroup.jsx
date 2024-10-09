import React from 'react';
import Form from 'react-bootstrap/Form';
import LayerToggle from './LayerToggle';
import { ListGroup } from 'react-bootstrap';


function LayerToggleGroup({ mapLoaded, toggleVisibility, layerIDLists, labels }) {

  return (
    <ListGroup variant='flush' as={Form}>
      {layerIDLists.map((layerIDs, index) => {
        return (
          <LayerToggle
            mapLoaded={mapLoaded}
            toggleVisibility={toggleVisibility}
            layerIDs={layerIDs}
            label={labels[index]}
          />
        )
      })}
    </ListGroup>
  );
}

export default LayerToggleGroup;