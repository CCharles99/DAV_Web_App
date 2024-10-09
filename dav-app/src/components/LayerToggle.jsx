import React, { useState, useEffect } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


function LayerToggle({ mapLoaded, toggleVisibility, layerIDs , label}) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!mapLoaded) return;
        layerIDs.forEach(layer => toggleVisibility(layer, visible))
    }, [visible])

    return (
        <ListGroupItem as={Form.Check}
            style={{paddingLeft: '38px', paddingTop: '6px', paddingBottom: '6px'}}
            type="checkbox"
            label={label}
            checked={visible}
            onChange={() => setVisible(show => !show)}
        />
    );
}

export default LayerToggle;