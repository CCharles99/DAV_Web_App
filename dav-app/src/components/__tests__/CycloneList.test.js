import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CycloneList from '../CycloneList';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CycloneList Component', () => {
  const tcList = [
    { id: 1, name: 'Cyclonea', basin: 'NI' },
    { id: 2, name: 'Cycloneb', basin: 'SI' },
    { id: 3, name: 'Cyclonec', basin: 'NI' },
  ];

  test('renders loading spinner when tcList is empty', () => {
    render(<CycloneList tcList={[]} />, { wrapper: MemoryRouter });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders cyclone list grouped by basin', () => {
    render(<CycloneList tcList={tcList} />, { wrapper: MemoryRouter });

    expect(screen.getByText('North Indian')).toBeInTheDocument();
    expect(screen.getByText('South Indian')).toBeInTheDocument();
    expect(screen.getByText('Cyclonea')).toBeInTheDocument();
    expect(screen.getByText('Cycloneb')).toBeInTheDocument();
    expect(screen.getByText('Cyclonec')).toBeInTheDocument();
  });

  test('navigates to cyclone details on item click', () => {
    render(<CycloneList tcList={tcList} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('Cyclonea'));
    expect(mockNavigate).toHaveBeenCalledWith('/cyclone/1/Cyclonea');

    fireEvent.click(screen.getByText('Cycloneb'));
    expect(mockNavigate).toHaveBeenCalledWith('/cyclone/2/Cycloneb');
  });

  test('does not render empty basins', () => {
    const tcListWithEmptyBasin = [
      { id: 1, name: 'Cyclonea', basin: 'NI' },
      { id: 2, name: 'Cycloneb', basin: 'SI' },
    ];

    render(<CycloneList tcList={tcListWithEmptyBasin} />, { wrapper: MemoryRouter });

    expect(screen.queryByText('North Atlantic')).not.toBeInTheDocument();
    expect(screen.queryByText('Eastern Pacific')).not.toBeInTheDocument();
  });
});