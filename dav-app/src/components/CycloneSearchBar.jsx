import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button, ListGroup, Modal } from 'react-bootstrap';
import tcRef from '../data/tcRef.json';

function CycloneSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState(tcRef.map(tc => capitalizeFirstLetter(tc.name)));
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const navigate = useNavigate();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce((term) => {
      if (term.length > 0) {
        let filteredSuggestions = [];
        if (isName(term)) {
          filteredSuggestions = tcRef.filter((suggestion) =>
            suggestion.name.toLowerCase().startsWith(term.toLowerCase())
          );
        } else if (isID(term)) {
          filteredSuggestions = tcRef.filter((suggestion) =>
            suggestion.id.startsWith(term)
          );
        }
        setSuggestions(filteredSuggestions.map((suggestion) => capitalizeFirstLetter(suggestion.name)));
      } else {
        setSuggestions(tcRef.map((suggestion) => capitalizeFirstLetter(suggestion.name)));
      }
      setShowSuggestions(true);
    }, 300), []
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let tc = tcRef.find((tc) => tc.name.toLowerCase() === searchTerm.toLowerCase());
    if (tc) {
      if (tc.name.startsWith('UNNAMED')) {
        navigate(`/cyclone/${tc.id}/${'UNNAMED'}`)
      } else {
        navigate(`/cyclone/${tc.id}/${tc.name}`)
      }
    } else {
      setShowModal(true);
    }
  };
  // why is clicking search triggering handle focus

  const handleFocus = () => {
    console.log(searchTerm)
    console.log(suggestions)
    setShowSuggestions(true);
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  function capitalizeFirstLetter(word) {
    if (!word) return '';
    return word.charAt(0) + word.slice(1).toLowerCase();
  }

  function isID(input) {
    let regex = /^\d+$/
    return regex.test(input)
  }

  function isName(input) {
    let regex = /^[a-zA-Z]+$/
    return regex.test(input)
  }

  return (
    <>
      <Modal size="sm" data-bs-theme="dark" show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton style={{color: '#dee2e6'}}>
          <Modal.Title>Invalid Name</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color: '#dee2e6'}}>
          Couldn't find a Tropical Cyclone with Name or ID: {searchTerm} <br/>
          Please try again 
        </Modal.Body>
      </Modal>

      <div style={{ position: 'relative' }} onBlur={handleBlur}>
        <Form className="d-flex" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          <Button variant="outline-secondary" type="submit">
            Search
          </Button>
        </Form>

        {showSuggestions && suggestions.length > 0 && (
          <ListGroup
            style={{
              position: 'absolute',
              zIndex: '1000',
              width: '100%',
              maxHeight: '150px',
              overflowY: 'auto'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </>
  );
}

export default CycloneSearchBar;
