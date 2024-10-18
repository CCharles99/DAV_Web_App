// CyclonePage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CyclonePage from '../CyclonePage.jsx';

// Mocking Mapbox
jest.mock('mapbox-gl', () => ({
  Map: () => ({}),
}));

describe('CyclonePage', () => {
  const mock = new MockAdapter(axios);

  const renderComponent = (tcID, tcName) => {
    return render(
      <MemoryRouter initialEntries={[`/cyclone/${tcID}/${tcName}`]}>
        <Routes>
          <Route path="/cyclone/:tcID/:tcName" element={<CyclonePage/>}/>
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    mock.reset();
  });

  test('displays loading initially', () => {
    renderComponent(1, 'TestCyclone');
    waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
  });

  test('page loads when name and ID match', () => {
    const mockData = { name: 'TestCyclone'};
    mock.onGet('/tc/byID/123').reply(200, mockData);

    renderComponent(123, 'TestCyclone');

    waitFor(() => expect(screen.getByText('Tropical Cyclone')).toBeInTheDocument());
  });

  test('displays error message when cyclone id and name do not match', () => {
    const mockData = { name: 'TestHurricane'};
    mock.onGet('/tc/byID/123').reply(200, mockData);

    renderComponent(123, 'TestCyclone');

    waitFor(() => expect(screen.getByText(`TC ID does not match TC Name. Expected pair: (${123}, ${mockData.name})`)).toBeInTheDocument());
  });

  test('displays error message when cyclone id does not exist', () => {
    mock.onGet('/tc/byID/123').reply(400);

    renderComponent(123, 'TestCyclone');

    waitFor(() => expect(screen.getByText(`TC ID does not exist: ${123}`)).toBeInTheDocument());
  });
});
