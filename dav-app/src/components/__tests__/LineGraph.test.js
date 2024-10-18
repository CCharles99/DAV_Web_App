import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LineGraph from '../LineGraph';
import { Line } from 'react-chartjs-2';

jest.mock('react-chartjs-2', () => ({
  Line: jest.fn()
}));

describe('LineGraph Component', () => {
  const centerDAVMock = [1000, 1500, 2000, 2500, 3000];
  const centerIntensityMock = [30, 60, 90, 120, 150];
  const frameMock = 2;

  test('renders without crashing', () => {
    Line.mockImplementationOnce(({data, options}) => {
      return <div>Mock Line</div>
    });
    const { container } = render(<LineGraph centerDAV={centerDAVMock} centerIntensity={centerIntensityMock} frame={frameMock} />);
    expect(container).toBeInTheDocument();
  });

  test('renders correct number of points', () => {
    Line.mockImplementationOnce(({data, options}) => {
      return <div>{data.datasets[0].data.length}</div>
    });
     render(<LineGraph centerDAV={centerDAVMock} centerIntensity={centerIntensityMock} frame={frameMock} />);
    expect(screen.getByText(centerDAVMock.length)).toBeInTheDocument(); // Chart.js renders the chart inside a single canvas element
  });
});