import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';


function LayerToggle({ mapLoaded, toggleVisibility, layerIDs , label}) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!mapLoaded) return;
        layerIDs.forEach(layer => toggleVisibility(layer, visible))
    }, [visible])

    return (
        <Form.Check
            type="checkbox"
            label={label}
            checked={visible}
            onChange={() => setVisible(show => !show)}
        />
    );
}

export default LayerToggle;