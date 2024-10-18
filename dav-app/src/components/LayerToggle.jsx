import React, { useState, useEffect } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


const LayerToggle = React.memo(({ mapLoaded, toggleVisibility, layerIDs, label, waitForLayer }) => {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!mapLoaded) return;
        layerIDs.forEach(layer => {
            waitForLayer(layer)
                .then(() => {
                    try {
                        toggleVisibility(layer, visible)

                    } catch (err) {
                        console.log(err)
                    }
                });
        })
    }, [visible, layerIDs]);

    return (
        <ListGroupItem as={Form.Check}
            style={{ paddingLeft: '38px', paddingTop: '6px', paddingBottom: '6px' }}
            type="checkbox"
            label={label}
            checked={visible}
            aria-label='Layer Toggle'
            onChange={() => setVisible(show => !show)}
        />
    );
});

export default LayerToggle;