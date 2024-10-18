import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { useSearchParams } from 'react-router-dom';

// Mocking Mapbox
jest.mock('mapbox-gl', () => ({
  Map: () => ({}),
}));

// Mocking components
jest.mock('../pages/MainPage', () => (props) => <div>MainPage Mock {Object.entries(props).map(prop => <div>{prop[0]}:{prop[1]}</div>)}</div>);
jest.mock('../pages/CyclonePage', () => () => <div>CyclonePage Mock</div>);
jest.mock('../components/DateSearchBar', () => (props) => <div>DateSearchBar Mock, {props.date}</div>);
jest.mock('../components/CycloneSearchBar', () => () => <div>CycloneSearchBar Mock</div>);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

// Mocking ViewData
jest.mock('../data/ViewData.json', () => [
  { symbol: 'VV', center: { lat: 10, lng: 20 }, zoom: 5, bounds: [10, 20, 30, 40] },
]);

describe('App Component', () => {
  // Mocking searchParams
  beforeEach(() => {
    useSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()]);
  });
  
  test('renders Navbar with correct brand', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const brandElement = screen.getByText(/DAV App/i);
    expect(brandElement).toBeInTheDocument();
  });

  test('renders DateSearchBar component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const dateSearchBarElement = screen.getByText(/DateSearchBar Mock/i);
    expect(dateSearchBarElement).toBeInTheDocument();
  });

  test('renders CycloneSearchBar component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const cycloneSearchBarElement = screen.getByText(/CycloneSearchBar Mock/i);
    expect(cycloneSearchBarElement).toBeInTheDocument();
  });

  test('renders MainPage component on default route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const mainPageElement = screen.getByText(/MainPage Mock/i);
    expect(mainPageElement).toBeInTheDocument();
  });

  test('Navbar receives searchParams correctly', () => {
    const mockSearchParams = new URLSearchParams({ date: '2022-09-20' });
    useSearchParams.mockReturnValueOnce([mockSearchParams, jest.fn()]);
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const date = screen.getByText(/DateSearchBar Mock, 2022-09-20/i);
    expect(date).toBeInTheDocument();
  });

  test('MainPage receives searchParams correctly', () => {
    const mockSearchParams = new URLSearchParams({
      date: '2022-09-23',
      lat: '10',
      lng: '20',
      zoom: '5',
      view: 'VV',
    });
    useSearchParams.mockReturnValueOnce([mockSearchParams, jest.fn()]);
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const props = screen.getAllByText(/date:2022-09-23|lat:10|lng:20|zoom:5|view:VV/i);
    props.forEach(prop => expect(prop).toBeInTheDocument());
  });

  test('renders CyclonePage component on /cyclone/:tcID/:tcName route', () => {
    useSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()]);
    window.history.pushState({}, 'CyclonePage', '/cyclone/123/abc');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const cyclonePageElement = screen.getByText(/CyclonePage Mock/i);
    expect(cyclonePageElement).toBeInTheDocument();
  });
});

