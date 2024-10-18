import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TCInfoCard from '../TCInfoCard';

describe('TCInfoCard Component', () => {
  const mockData = {
    center: [[-73.935242, 40.730610]],
    time: ['2023-10-01 12:00:00']
  };

  test('renders without crashing', () => {
    const { getByText } = render(
      <TCInfoCard tcData={mockData} tcName="Test Cyclone" frame={0}>
        <div>Child Component</div>
      </TCInfoCard>
    );
    expect(getByText('Tropical Cyclone Test Cyclone')).toBeInTheDocument();
  });

  test('displays the correct date', () => {
    const { getByText } = render(
      <TCInfoCard tcData={mockData} tcName="Test Cyclone" frame={0}>
        <div>Child Component</div>
      </TCInfoCard>
    );
    expect(getByText('Date: Sun Oct 01 2023')).toBeInTheDocument();
  });

  test('displays the correct latitude and longitude', () => {
    const { getByText } = render(
      <TCInfoCard tcData={mockData} tcName="Test Cyclone" frame={0}>
        <div>Child Component</div>
      </TCInfoCard>
    );
    expect(getByText(/Latitude: N 40.73, Longitude: W 73.94/i)).toBeInTheDocument();
  });

  test('renders children correctly', () => {
    const { getByText } = render(
      <TCInfoCard tcData={mockData} tcName="Test Cyclone" frame={0}>
        <div>Child Component</div>
      </TCInfoCard>
    );
    expect(getByText('Child Component')).toBeInTheDocument();
  });
});