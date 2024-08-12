import React, { useState } from 'react';

function BookmarkList({handleSearch, lng, lat, zoom, view, date}) {
    const [bookmarkList, setBookmarkList] = useState([]);
    const [bookmarkCount, setBookmarkCount] = useState(1);

    function addBookmark() {
        const newBookmark = {
            name: `${bookmarkCount}`,
            lng: lng,
            lat: lat,
            zoom: zoom,
            view: `${view.split('-')[0]}-b${bookmarkCount}`,
            date: date
        }
        setBookmarkList([...bookmarkList, newBookmark]);
        setBookmarkCount(bookmarkCount + 1);
    }

    function handleDelete(bookmarkName) {
        setBookmarkList((bookmarkList) => bookmarkList.filter(bookmark => bookmark.name !== bookmarkName));
    }

    return (
        <div>
            {bookmarkList.map(bookmark => (
                <div className='bookmark--container'>
                    <button
                        onClick={() => {
                            handleSearch({lng: bookmark.lng, lat: bookmark.lat, zoom: bookmark.zoom, view: bookmark.view, date: bookmark.date, freeCam: true});
                        }}
                    >Bookmark {bookmark.name}</button>
                    <button onClick={() => handleDelete(bookmark.name)}>del</button>
                </div>
            ))}
            <button onClick={addBookmark}>add bookmark</button>
        </div>
    );
}

export default BookmarkList;