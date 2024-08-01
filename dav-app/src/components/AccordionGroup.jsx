import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import BookmarkList from './BookmarkList';
import ViewList from './ViewList';
import "../custom.css";

function AccordionGroup(props) {

    return (
        <div className='accordion-container'>
            <Accordion defaultActiveKey={['0', '1']} alwaysOpen bg
                className="bg-body-tertiary"
                data-bs-theme="dark">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Views</Accordion.Header>
                    <Accordion.Body>
                        <ViewList {...props} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Bookmarks</Accordion.Header>
                    <Accordion.Body>
                        <BookmarkList {...props} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}
export default AccordionGroup;