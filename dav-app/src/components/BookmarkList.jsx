import React, { useState } from 'react';

function BookmarkList(props) {
    const [bookmarkList, setBookmarkList] = useState([]);
    const [bookmarkCount, setBookmarkCount] = useState(1);

    function addBookmark(bookmarkCenter, bookmarkZoom, bookmarkView) {
        const newBookmark = {
            name: `${bookmarkCount}`,
            center: bookmarkCenter,
            zoom: bookmarkZoom,
            view: bookmarkView
        }
        setBookmarkList([...bookmarkList, newBookmark]);
        setBookmarkCount(bookmarkCount + 1);
    }

    function handleDelete(bookmarkName) {
        const result = bookmarkList.filter(bookmark => bookmark.name !== bookmarkName);
        setBookmarkList(result);
    }

    return (
        <div>
            {bookmarkList.map(bookmark => (
                <div className='bookmark--container'>
                    <button
                        onClick={() => {
                            props.handleJump(bookmark.center, bookmark.zoom);
                            props.setFreeCam(true);
                            props.handleView(bookmark.view);
                        }}
                    >Bookmark {bookmark.name}</button>
                    <button onClick={() => handleDelete(bookmark.name)}>del</button>
                </div>
            ))}
            <button onClick={() => addBookmark(props.center, props.zoom, props.view)}>add bookmark</button>
        </div>
    );
}

export default BookmarkList;