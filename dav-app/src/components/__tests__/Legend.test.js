import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Legend from '../Legend';

describe('Legend Component', () => {
  test('renders without crashing', () => {
    const { getByText } = render(<Legend />);
    expect(getByText('Legend')).toBeInTheDocument();
  });

  test('renders all images', () => {
    const { getAllByRole } = render(<Legend />);
    const images = getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  test('renders images with correct src attributes', () => {
    const { getAllByRole } = render(<Legend />);
    const images = getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'DAVColorbar.png');
    expect(images[1]).toHaveAttribute('src', 'IRColorbar.png');
    expect(images[2]).toHaveAttribute('src', 'TrackColorbar.png');
  });

  test('renders Card with dark theme', () => {
    const { container } = render(<Legend />);
    const card = container.querySelector('.card[data-bs-theme="dark"]');
    expect(card).toBeInTheDocument();
  });

  test('renders Card Title with correct text', () => {
    const { getByText } = render(<Legend />);
    const cardTitle = getByText('Legend');
    expect(cardTitle).toBeInTheDocument();
  });
});