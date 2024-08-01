import React, { useRef, useState } from 'react';
import data from '../data/ViewData.json'

function ViewList(props) {

    const [viewData, setViewData] = useState(data);
    return (
        <div>
            {viewData.map(view => (
                <div className='bookmark--container'>
                    <button
                        onClick={() => {
                            props.handleJump(view.center, view.zoom);
                            props.setFreeCam(false);
                            props.handleView({symbol: view.symbol, bounds: view.bounds})
                        }}
                    >{view.name}</button>
                </div>
            ))}
            <button onClick={() => props.setFreeCam(true)}>Free Mode</button>
        </div>
    );
}

export default ViewList;