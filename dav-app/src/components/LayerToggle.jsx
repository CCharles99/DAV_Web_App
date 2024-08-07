import React from 'react';
import Form from 'react-bootstrap/Form';


function LayerToggle({ showDAV, showIR, setShowDAV, setShowIR, toggleVisibility }) {



    return (
        <div>
            <Form>
                <input checked="showDAV" id="davCheck" type="checkbox" onChange={toggleVisibility('dav-layer', () => setShowDAV)} />
                <label for="davCheck">Show DAV</label>
                
     

                <Form.Check
                    type={"checkbox"}
                    label={"Show IR"}
                    checked={showIR}
                >
                    <Form.Control onChange={toggleVisibility('ir-layer', () => setShowIR)} />
                </Form.Check>
            </Form>
        </div>
    );
}

export default LayerToggle;