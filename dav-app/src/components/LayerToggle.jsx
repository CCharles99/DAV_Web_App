import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';


function LayerToggle({ mapLoaded, toggleVisibility}) {

    const [showDAV, setShowDAV] = useState(true);
    const [showIR, setShowIR] = useState(true);
    const [showIcons, setShowIcons] = useState(true);

    useEffect(() => {
        if (!mapLoaded) return;
        toggleVisibility('dav-layer', showDAV)
    }, [showDAV])

    useEffect(() => {
        if (!mapLoaded) return;
        toggleVisibility('ir-layer', showIR)
    }, [showIR]);

    useEffect(() => {
        if (!mapLoaded) return;
        toggleVisibility('tc-icon-layer', showIcons)
    }, [showIcons]);

    

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
            <Form.Check
                type="checkbox"
                label="Show Icons"
                checked={showIcons}
                onChange={() => setShowIcons(show => !show)}
            />
        </Form>
    );
}

export default LayerToggle;