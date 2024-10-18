import React from 'react';
import { render } from '@testing-library/react';
import AccordionItem from '../AccordionItem';
import Accordion from 'react-bootstrap/Accordion';

describe('AccordionItem', () => {
  test('renders without crashing', () => {
    const { getByText } = render(
      <Accordion>
        <AccordionItem eventKey="0" header="Test Header">
          Test Body
        </AccordionItem>
      </Accordion>
    );
    expect(getByText('Test Header')).toBeInTheDocument();
    expect(getByText('Test Body')).toBeInTheDocument();
  });

  test('applies custom styles to Accordion.Body', () => {
    const { getByText } = render(
      <Accordion>
        <AccordionItem eventKey="0" header="Test Header">
          Test Body
        </AccordionItem>
      </Accordion>
    );
    const body = getByText('Test Body');
    expect(body).toHaveStyle('padding: 10px');
  });

  test('renders children correctly', () => {
    const { getByText } = render(
      <Accordion>
        <AccordionItem eventKey="0" header="Test Header">
          <div>Child 1</div>
          <div>Child 2</div>
        </AccordionItem>
      </Accordion>
    );
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });
});