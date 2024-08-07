import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

function DateSearchBar() {
    const navigate = useNavigate();
    const [dateValue, setDateValue] = useState("");

    const handleSubmit = (event) => {
        // event.preventDefault();
        // navigate(`/date/${dateValue}`)
        console.log(event);
    }

    const handleSelect = (event) => {
        setDateValue(event.target.value);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
                <Form.Control
                    onChange={handleSelect}
                    type="date" name="date"
                    value={dateValue}
                    min="2022-09-20"
                    max="2022-09-24"
                />
                <Button variant="outline-secondary" id="button-addon2" type="submit">
                    Go
                </Button>
            </InputGroup>
        </Form>
    );
}

export default DateSearchBar;