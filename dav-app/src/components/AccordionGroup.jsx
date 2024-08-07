import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import "../custom.css";

function AccordionGroup({ children, defaultActiveKeys}) {
  return (
    <div className='accordion-container'>
      <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen bg
        className="bg-body-tertiary"
        data-bs-theme="dark">
          {children}
      </Accordion>
    </div>
  );
}
export default AccordionGroup;