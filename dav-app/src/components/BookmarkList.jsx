import React, { useState } from 'react';

function BookmarkList({handleSearch, lng, lat, zoom, view}) {
    const [bookmarkList, setBookmarkList] = useState([]);
    const [bookmarkCount, setBookmarkCount] = useState(1);

    function addBookmark(bookmarkLng, bookmarkLat, bookmarkZoom, bookmarkView) {
        const newBookmark = {
            name: `${bookmarkCount}`,
            lng: bookmarkLng,
            lat: bookmarkLat,
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
                            console.log()
                            handleSearch({lng: bookmark.lng, lat: bookmark.lat, zoom: bookmark.zoom, view: bookmark.view, freeCam: true});
                        }}
                    >Bookmark {bookmark.name}</button>
                    <button onClick={() => handleDelete(bookmark.name)}>del</button>
                </div>
            ))}
            <button onClick={() => addBookmark(lng, lat, zoom, view)}>add bookmark</button>
        </div>
    );
}

export default BookmarkList;