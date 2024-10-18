import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewList from '../ViewList';

describe('ViewList Component', () => {
  const mockHandleSearch = jest.fn();
  const mockViewData = [
    { symbol: 'view1', name: 'View 1', center: { lng: 10, lat: 20 }, zoom: 5 },
    { symbol: 'view2', name: 'View 2', center: { lng: 30, lat: 40 }, zoom: 10 }
  ];
  const mockCurrentView = 'view1';

  test('renders without crashing', () => {
    render(<ViewList handleSearch={mockHandleSearch} viewData={mockViewData} currentView={mockCurrentView} />);
    expect(screen.getByText('View 1')).toBeInTheDocument();
    expect(screen.getByText('View 2')).toBeInTheDocument();
  });

  test('applies correct styles to the current view', () => {
    render(<ViewList handleSearch={mockHandleSearch} viewData={mockViewData} currentView={mockCurrentView} />);
    const currentViewItem = screen.getByText('View 1');
    expect(currentViewItem).toHaveStyle('padding-left: 30px');
  });

  test('calls handleSearch with correct parameters when a view is clicked', () => {
    render(<ViewList handleSearch={mockHandleSearch} viewData={mockViewData} currentView={mockCurrentView} />);
    const viewItem = screen.getByText('View 2');
    fireEvent.click(viewItem);
    expect(mockHandleSearch).toHaveBeenCalledWith({ lng: 30, lat: 40, zoom: 10, view: 'view2' });
  });
});