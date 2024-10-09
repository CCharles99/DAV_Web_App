import React, { useState } from 'react';
import { BsTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import { Button, ListGroup, ListGroupItem, Modal, Form } from 'react-bootstrap';

function BookmarkList({ handleSearch, lng, lat, zoom, view, date, setBookmark }) {
    const [bookmarkList, setBookmarkList] = useState([]);
    const [bookmarkCount, setBookmarkCount] = useState(1);
    const [inputError, setInputError] = useState({ error: false, message: "" });
    const [bookmarkName, setBookmarkName] = useState('Untitled');
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (event) => {
        setBookmarkName(event.target.value);
    }

    const handleCancel = () => {
        setShowModal(false);
        setBookmarkName('Untitled');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (bookmarkList.map(bookmark => bookmark.name).includes(bookmarkName)) {
            setInputError({ error: true, message: "Bookmark Name Already exists" });
            return;
        } else {
            setInputError({ error: false, message: "" });
        }

        if (inputError.error) return;
        addBookmark();
        setShowModal(false);
    }

    const handleBookmarkSelect = (bookmark) => {
        handleSearch({ lng: bookmark.lng, lat: bookmark.lat, zoom: bookmark.zoom, view: bookmark.view, date: bookmark.date });
        setBookmark(bookmark.name);
    }

    function addBookmark() {
        const newBookmark = {
            name: `${bookmarkName}`,
            lng: lng,
            lat: lat,
            zoom: zoom,
            view: `${view.split('-')[0]}-b`,
            date: date
        }
        setBookmarkList([...bookmarkList, newBookmark]);
        setBookmarkCount(bookmarkCount => bookmarkCount + 1);

    }

    function handleDelete(bookmarkName) {
        setBookmarkList((bookmarkList) => bookmarkList.filter(bookmark => bookmark.name !== bookmarkName));
    }

    return (
        <>
            <ListGroup variant='flush'>
                {bookmarkList.map(bookmark => (
                    <ListGroupItem
                        action
                        style={{ padding:'0px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
                    >
                        <Button
                            variant='flush'
                            style={{ textAlign: 'left',  paddingTop: '6px', paddingBottom: '6px', paddingLeft: '16px', margin: '0px', height: '100%', width: '80%', scrollbarWidth: 'none', overflowX: 'auto' }}
                            onClick={() => handleBookmarkSelect(bookmark)}
                        >
                            {bookmark.name}
                        </Button>
                        <Button
                            variant='flush'
                            style={{ padding: '0px', paddingBottom: '7px', paddingRight: '6px'}}
                            onClick={() => handleDelete(bookmark.name)}
                        >
                            <BsTrashFill size='20px'/>
                        </Button>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant='flush'
                    style={{ padding: '0px' }}
                    onClick={() => setShowModal(true)}
                >
                    <BsPlusCircleFill size='24px' />
                </Button>
            </div>
            <Modal size="sm" data-bs-theme="dark" show={showModal} onHide={() => setShowModal(false)} >
                <Modal.Header closeButton style={{ color: '#dee2e6' }}>
                    <Modal.Title>Add new Bookmark</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: '#dee2e6' }}>
                    <Form onSubmit={handleSubmit} >
                        <Form.Control
                            onChange={handleInputChange}
                            type="text"
                            value={bookmarkName}
                            defaultValue={`Bookmark ${bookmarkCount}`}
                            placeholder='New Name'
                            maxLength={30}
                        />
                        <Button variant="outline-secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default BookmarkList;