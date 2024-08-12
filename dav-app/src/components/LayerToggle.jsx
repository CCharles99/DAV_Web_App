import React, { useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';


function LayerToggle({ mapLoaded, toggleVisibility, setSourceImage, frame }) {

    const [showDAV, setShowDAV] = useState(true);
    const [showIR, setShowIR] = useState(true);

    useEffect(() => {
        if (!mapLoaded.current) return;
        setTimeout(() => {
            toggleVisibility('dav-layer', showDAV)
          }, 100);
    }, [showDAV])

    useEffect(() => {
        if (!mapLoaded.current) return;
        setTimeout(() => {
            toggleVisibility('ir-layer', showIR)
        }, 100);
    }, [showIR]);

    useEffect(() => {
        if (mapLoaded.current) {
            if (showDAV) { setSourceImage('DAV') };
            if (showIR) { setSourceImage('IR') };
        }
    }, [frame, showDAV, showIR]);

    return (
        <Form>
            <Form.Check
                type="checkbox"
                label="Show DAV"
                checked={showDAV}
                onChange={() => setShowDAV(show => !show)}
            />
            <Form.Check
                type="checkbox"
                label="Show IR"
                checked={showIR}
                onChange={() => setShowIR(show => !show)}
            />
        </Form>
    );
}

export default LayerToggle;