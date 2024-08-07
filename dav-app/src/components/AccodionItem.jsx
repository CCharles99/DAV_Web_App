import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import "../custom.css";

function AccordionGroup(props) {
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.header}</Accordion.Header>
      <Accordion.Body>
        {props.children}
      </Accordion.Body>
    </Accordion.Item>
  );
}
export default AccordionGroup;