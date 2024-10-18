import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import DateSearchBar from '../DateSearchBar';


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('DateSearchBar', () => {
  const handleSearchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders DateSearchBar component', () => {
    render(
      <MemoryRouter>
        <DateSearchBar handleSearch={handleSearchMock} date="2022-09-15" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Date Selector')).toBeInTheDocument();
    expect(screen.getByLabelText('Go')).toBeInTheDocument();
  });

  test('calls handleSearch with the correct date when on the root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DateSearchBar handleSearch={handleSearchMock} date="2022-09-15" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Date Selector'), { target: { value: '2022-09-20' } });
    fireEvent.click(screen.getByLabelText('Go'));

    expect(handleSearchMock).toHaveBeenCalledWith({ date: '2022-09-20' });
  });

  test('navigates to the correct URL when not on the root path', () => {
    render(
      <MemoryRouter initialEntries={['/other']}>
        <DateSearchBar handleSearch={handleSearchMock} date="2022-09-15" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Date Selector'), { target: { value: '2022-09-20' } });
    fireEvent.click(screen.getByLabelText('Go'));

    expect(mockNavigate).toHaveBeenCalledWith('/?date=2022-09-20');
  });

  test('does not call handleSearch or navigate if dateValue is undefined', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DateSearchBar handleSearch={handleSearchMock} date={undefined} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Go'));

    expect(handleSearchMock).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('updates dateValue when date prop changes', () => {
    const { rerender } = render(
      <MemoryRouter>
        <DateSearchBar handleSearch={handleSearchMock} date="2022-09-15" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Date Selector').value).toBe('2022-09-15');

    rerender(
      <MemoryRouter>
        <DateSearchBar handleSearch={handleSearchMock} date="2022-09-20" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Date Selector').value).toBe('2022-09-20');
  });
});