import React from 'react';
import Form from 'react-bootstrap/Form';
import LayerToggle from './LayerToggle';


function LayerToggleGroup({ mapLoaded, toggleVisibility, layerIDLists, labels }) {

  return (
    <Form>
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
    </Form>
  );
}

export default LayerToggleGroup;