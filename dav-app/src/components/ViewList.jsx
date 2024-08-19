import React from 'react';

function ViewList({handleSearch, viewData}) {

    return (
        <div>
            {viewData.map(view => (
                <div className='bookmark--container'>
                    <button
                        onClick={() => {
                            handleSearch({lng: view.center.lng, lat: view.center.lat, zoom: view.zoom, view: view.symbol, freeCam: false});
                        }}
                    >{view.name}</button>
                </div>
            ))}
            <button onClick={() => handleSearch({freeCam: true})}>Free Mode</button>
        </div>
    );
}

export default ViewList;