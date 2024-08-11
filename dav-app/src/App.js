import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import MainPage from './pages/MainPage';
import DateSearchBar from './components/DateSearchBar'
import viewData from './data/ViewData.json';


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

  const handleSearch = (newParams) => {
    setSearchParams((prevParams) => {
      prevParams = Object.fromEntries(prevParams.entries());
      console.log(prevParams);
      console.log(newParams);
      return new URLSearchParams({
        ...prevParams,
        ...newParams,
      });
    });
  }

  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme="dark">
        <div className='navbar-container'>
          <Navbar.Brand hState='#'>DAV App</Navbar.Brand>
          <div className='datesearchbar--container'>
            <DateSearchBar date={searchParams.get("date")} handleSearch={handleSearch} />
          </div>
        </div>
      </Navbar>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              date={searchParams.get("date") || "2022-09-23"}
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
      </Routes>
    </>
  )
};


export default App;


/*
<navbar>
  <title>
  <searchbar>
    <search by name>
    <search location>
  <date form>
  <about>
<sidepanel>
  <Accordion>
    <item: basin>
      <title>
      <list>
        <basins>
    <item: bookmark>
      <title>
      <scrollable list>
        <bookmarks>
      <add bookmark button>
<map container>
  <map>
  <playbar>
  <toggle box>
    <list>
      <toggleables>


*/

/*
TODO:
  - separate {view.symbol, view.bounds} into view and viewBounds.
  - do useSearchParams for date, center, zoom, view, freeCam. This should make bookmarking the date easier and a bunch of handlers can be removed maybe
  - create cyclone list, search bar and page
  - 
**/