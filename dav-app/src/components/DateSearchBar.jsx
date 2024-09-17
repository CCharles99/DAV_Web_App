import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function DateSearchBar({handleSearch, date}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [dateValue, setDateValue] = useState(date);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (dateValue === undefined) return;
        if (location.pathname !== '/') {
            navigate(`/?${new URLSearchParams({date: dateValue})}`)
        } else {
            handleSearch({date: dateValue})
        }
    }

    const handleSelect = (event) => {
        setDateValue(event.target.value);
    }

    useEffect(() => {
        setDateValue(dateValue => date || dateValue);
    }, [date])

    return (
        <Form onSubmit={handleSubmit} className='datesearchbar-container'>
                <Form.Control
                    onChange={handleSelect}
                    type="date" name="date"
                    value={dateValue}
                    min="2022-09-01"
                    max="2022-09-30"
                />
                <Button variant="outline-secondary" type="submit">
                    Go
                </Button>
        </Form>
    );
}

export default DateSearchBar;