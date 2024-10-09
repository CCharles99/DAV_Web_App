import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import "../custom.css";

function AccordionItem(props) {
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.header}</Accordion.Header>
      <Accordion.Body style={{padding: '10px'}}>
        {props.children}
      </Accordion.Body>
    </Accordion.Item>
  );
}
export default AccordionItem;