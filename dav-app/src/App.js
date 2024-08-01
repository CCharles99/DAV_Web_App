import './App.css';
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import MainPage from './pages/MainPage';
import DateSearchBar from './components/DateSearchBar'

function Test() {
  let { id } = useParams();
  return (
      <div style={{ fontSize: "50px" }}>
          Now showing {id}
      </div>
  );
}

function App() {

  return (
    <Router>
      <header>
        <Navbar  className="bg-body-tertiary" data-bs-theme="dark">
          <div className='navbar-container'>
            <Navbar.Brand href='#'>DAV App</Navbar.Brand>
            <div className='datesearchbar--container'>
              <DateSearchBar />
            </div>
          </div>
        </Navbar>
      </header>
      <Routes>
        <Route path="/date/:date?" element = {<MainPage/>}/>
        <Route path="/test/:id" element = {<Test/>}/>
      </Routes>
    </Router>
  );
}

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
  - 

**/