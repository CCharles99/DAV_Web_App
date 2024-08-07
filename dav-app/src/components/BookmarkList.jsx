import React, { useState } from 'react';

function BookmarkList({handleJump, setFreeCam, handleView, center, zoom, view}) {
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
                            handleJump(bookmark.center, bookmark.zoom);
                            setFreeCam(true);
                            handleView(bookmark.view);
                        }}
                    >Bookmark {bookmark.name}</button>
                    <button onClick={() => handleDelete(bookmark.name)}>del</button>
                </div>
            ))}
            <button onClick={() => addBookmark(center, zoom, view)}>add bookmark</button>
        </div>
    );
}

export default BookmarkList;