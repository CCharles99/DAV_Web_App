import React from 'react';
import axios from 'axios';

export default function TestPage(){
    const [response, setResponse] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:5000/test-route/')
        .then( response => {
            setResponse(response.data);
        })
        .catch((err) => console.log(err));
    }, [])
    
    return (
        <div>
            <h2>{response}</h2>
        </div>
    )
}
