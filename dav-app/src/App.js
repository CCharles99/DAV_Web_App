import './App.css';
import { Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import MainPage from './pages/MainPage';
import CyclonePage from './pages/CyclonePage';
import DateSearchBar from './components/DateSearchBar'
import viewData from './data/ViewData.json';
import React, { useState } from 'react';


function Test() {
  let { id } = useParams();
  return (
    <div style={{ fontSize: "50px" }}>
      Now showing {id}
    </div>
  );
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [date, setDate] = useState(searchParams.get("date") || '2022-09-23');

  const handleSearch = (newParams) => {
    setSearchParams((prevParams) => {
      prevParams = Object.fromEntries(prevParams.entries());
      return new URLSearchParams({
        ...prevParams,
        ...newParams,
      });
    });
    // if (Object.hasOwn(newParams, 'date')) { setDate(newParams.date)}

  }

  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme="dark">
        <div className='navbar-container'>
          <Navbar.Brand hState='#'>DAV App</Navbar.Brand>
          <div className='datesearchbar--container'>
            <DateSearchBar date={searchParams.get("date") || undefined} handleSearch={handleSearch} />
          </div>
        </div>
      </Navbar>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              date={searchParams.get("date") || '2022-09-23'}
              lat={searchParams.get("lat") || viewData[0].center.lat}
              lng={searchParams.get("lng") || viewData[0].center.lng}
              zoom={searchParams.get("zoom") || viewData[0].zoom}
              view={searchParams.get("view") || viewData[0].symbol}
              viewBounds={searchParams.has("view") ? viewData.find((view) => view.symbol === searchParams.get("view").split('-')[0]).bounds : viewData[0].bounds}
              freeCam={JSON.parse(searchParams.get("freeCam")) || false}
              handleSearch={handleSearch}
            />
          }
        />
        <Route path="/test/:id" element={<Test />} />
        <Route path="/cyclone/:tcID/:tcName" element={<CyclonePage />} />
      </Routes>
    </>
  )
};

export default App;

/*
TODO:
  - cyclones
    - create searchbar
  - cyclone info card
    - ask scott and liz which data to show
  - 

  NEXT:
  - time: 
      - gmt for main page
      - gmt and local for cyclone page
  - land mask exclude dav. if possible include tc (cv2 for image resize)

**/