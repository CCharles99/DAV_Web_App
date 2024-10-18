import React from 'react';
import loremIpsum from '../assets/lorem-ipsum_merged.pdf';
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div className='page'>
      <Container fluid style={{ height: '100%' }} className="bg-body-tertiary">
        <Row style={{ height: '100%' }}>
          <Col sm={8} className='p-0'>
            <iframe
              src={loremIpsum}
              width="100%"
              height="100%"
              title="PDF Document"
            />
          </Col>
          <Col sm={4}  className='p-1 bg-body-secondary'>
          <Card className="bg-body-tertiary" >
            <Card.Body>
              <Card.Title>
                Select Article
              </Card.Title>
            </Card.Body>
          </Card>
            <ListGroup className="bg-body-tertiary">
              <ListGroupItem>Article 1</ListGroupItem>
              <ListGroupItem>Article 1</ListGroupItem>
              <ListGroupItem>Article 1</ListGroupItem>
            </ListGroup>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;