import './App.css';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import MainPage from './pages/MainPage';
import CyclonePage from './pages/CyclonePage';
import AboutPage from './pages/AboutPage';
import DateSearchBar from './components/DateSearchBar'
import CycloneSearchBar from './components/CycloneSearchBar'
import viewData from './data/ViewData.json';
import React from 'react';
import { Col, Container } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';

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
  }

  return (
    <div>
      <Navbar className="border border-light-subtle bg-body-tertiary" data-bs-theme="dark">
        <Container fluid>
          <Col lg={1.5} sm={1.5} md={2}>
            <Navbar.Brand href='/'>DAV App</Navbar.Brand>
          </Col>
          <Col sm={2}>
            <DateSearchBar date={searchParams.get("date") || undefined} handleSearch={handleSearch} />
          </Col>
          <Col sm={3}>
            <CycloneSearchBar />
          </Col>
          <Col sm={2} className="d-flex justify-content-end align-items-center">
          <a className='icon-link' href='/about'>

            <div className='text-body p-1'>
              About DAV
            </div>
            <BsQuestionCircle className='pe-auto text-body' size='24px'  />
          </a>
          </Col>
        </Container>
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
              handleSearch={handleSearch}
            />
          }
        />
        <Route path="/cyclone/:tcID/:tcName" element={<CyclonePage />} />
        <Route path='/about' element={<AboutPage />} />
      </Routes>
    </div>
  )
};

export default App;