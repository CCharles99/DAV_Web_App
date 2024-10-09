import './App.css';
import { Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import MainPage from './pages/MainPage';
import CyclonePage from './pages/CyclonePage';
import DateSearchBar from './components/DateSearchBar'
import CycloneSearchBar from './components/CycloneSearchBar'
import viewData from './data/ViewData.json';
import React from 'react';
import { Col, Container} from 'react-bootstrap';


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
  }

  return (
    <div >
      <Navbar className="bg-body-tertiary" data-bs-theme="dark">
        <Container fluid>
            <Col lg={1.5} sm={1.5} md={2}>
              <Navbar.Brand>DAV App</Navbar.Brand>
            </Col>
            <Col xl={2}>
              <DateSearchBar date={searchParams.get("date") || undefined} handleSearch={handleSearch} />
            </Col>
            <Col sm={3} >
              <CycloneSearchBar />
            </Col>
            <Col lg={2}/>
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
        <Route path="/test/:id" element={<Test />} />
        <Route path="/cyclone/:tcID/:tcName" element={<CyclonePage />} />
      </Routes>
    </div>
  )
};

export default App;