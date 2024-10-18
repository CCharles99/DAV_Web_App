import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LayerToggle from '../LayerToggle';

describe('LayerToggle Component', () => {
  const mockToggleVisibility = jest.fn();
  const mockWaitForLayer = jest.fn();
  const layerIDs = ['layer1', 'layer2'];
  const label = 'Layer Toggle';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial state', () => {
    mockWaitForLayer.mockReturnValue(Promise.resolve());
    render(
      <LayerToggle
        mapLoaded={true}
        toggleVisibility={mockToggleVisibility}
        layerIDs={layerIDs}
        label={label}
        waitForLayer={mockWaitForLayer}
      />
    );

    const checkbox = screen.getByLabelText(label);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  test('toggles visibility state on change', () => {
    mockWaitForLayer.mockReturnValue(Promise.resolve());
    render(
      <LayerToggle
        mapLoaded={true}
        toggleVisibility={mockToggleVisibility}
        layerIDs={layerIDs}
        label={label}
        waitForLayer={mockWaitForLayer}
      />
    );

    const checkbox = screen.getByLabelText(label);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('calls toggleVisibility with correct arguments when map is loaded', async () => {
    mockWaitForLayer.mockReturnValue(Promise.resolve());
    render(
      <LayerToggle
        mapLoaded={true}
        toggleVisibility={mockToggleVisibility}
        layerIDs={layerIDs}
        label={label}
        waitForLayer={mockWaitForLayer}
      />
    );

    await Promise.all(layerIDs.map(layer => mockWaitForLayer(layer)));

    layerIDs.forEach(layer => {
      expect(mockToggleVisibility).toHaveBeenCalledWith(layer, true);
    });
  });

  test('does not call toggleVisibility when map is not loaded', () => {
    mockWaitForLayer.mockReturnValue(Promise.resolve());
    render(
      <LayerToggle
        mapLoaded={false}
        toggleVisibility={mockToggleVisibility}
        layerIDs={layerIDs}
        label={label}
        waitForLayer={mockWaitForLayer}
      />
    );

    layerIDs.forEach(layer => {
      expect(mockToggleVisibility).not.toHaveBeenCalled();
    });
  });

  test('handles errors in toggleVisibility gracefully', async () => {
    mockWaitForLayer.mockReturnValue(Promise.resolve());
    const errorToggleVisibility = jest.fn(() => {
      throw new Error('Test error');
    });

    render(
      <LayerToggle
        mapLoaded={true}
        toggleVisibility={errorToggleVisibility}
        layerIDs={layerIDs}
        label={label}
        waitForLayer={mockWaitForLayer}
      />
    );

    await Promise.all(layerIDs.map(layer => mockWaitForLayer(layer)));

    layerIDs.forEach(layer => {
      expect(errorToggleVisibility).toHaveBeenCalledWith(layer, true);
    });
  });
});