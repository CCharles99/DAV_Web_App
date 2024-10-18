import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CycloneSearchBar from '../CycloneSearchBar';
import tcRef from '../../data/tcRef.json';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CycloneSearchBar', () => {
  test('renders search bar and button', () => {
    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  test('shows suggestions on focus', async () => {
    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    await waitFor(() => {
      const suggestions = screen.getAllByLabelText('Suggestion');
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  test('filters suggestions based on input', async () => {
    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'F' } });
    await waitFor(() => {
      const suggestions = screen.getAllByLabelText('Suggestion');
      expect(suggestions.length).toBeGreaterThan(0);
      suggestions.forEach((suggestion) => {
        expect(suggestion.textContent.toLowerCase().startsWith('f')).toBe(true);
      });
    });
  });

  test('handles search with valid name', async () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: tcRef[0].name } });
    fireEvent.submit(screen.getByLabelText('Search'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(`/cyclone/${tcRef[0].id}/${tcRef[0].name}`);
    });
  });

  test('shows modal on invalid search', async () => {
    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'InvalidName' } });
    fireEvent.submit(screen.getByLabelText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/Couldn't find a Tropical Cyclone/i)).toBeInTheDocument();
    });
  });

  test('handles suggestion click', async () => {
    render(
      <Router>
        <CycloneSearchBar />
      </Router>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    await waitFor(() => {
      const suggestion = screen.getAllByLabelText('Suggestion')[0];
      fireEvent.click(suggestion);
      expect(input.value).toBe(suggestion.textContent);
    });
  });
});