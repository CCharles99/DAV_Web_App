import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function ViewList({ handleSearch, viewData, currentView }) {

    return (
        <ListGroup variant="flush" >
            {viewData.map(view => (
                <ListGroupItem style={(currentView === view.symbol) ? {paddingTop: '6px', paddingBottom: '6px', paddingLeft: '30px'} : {paddingTop: '6px', paddingBottom: '6px'}} action onClick={() => handleSearch({ lng: view.center.lng, lat: view.center.lat, zoom: view.zoom, view: view.symbol })}>
                    {view.name}
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default ViewList;