import React, { useRef, useState } from 'react';
import data from '../data/ViewData.json'

function ViewList({handleJump, setFreeCam, handleView}) {

    const [viewData, setViewData] = useState(data);
    return (
        <div>
            {viewData.map(view => (
                <div className='bookmark--container'>
                    <button
                        onClick={() => {
                            handleJump(view.center, view.zoom);
                            setFreeCam(false);
                            handleView({symbol: view.symbol, bounds: view.bounds})
                        }}
                    >{view.name}</button>
                </div>
            ))}
            <button onClick={() => setFreeCam(true)}>Free Mode</button>
        </div>
    );
}

export default ViewList;