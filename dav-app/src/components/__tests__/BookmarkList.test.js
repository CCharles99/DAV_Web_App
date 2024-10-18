import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookmarkList from '../BookmarkList';

describe('BookmarkList Component', () => {
  const mockHandleSearch = jest.fn();
  const mockSetBookmark = jest.fn();
  const defaultProps = {
    handleSearch: mockHandleSearch,
    lng: 10,
    lat: 20,
    zoom: 5,
    view: 'default-view',
    date: '2023-10-01',
    setBookmark: mockSetBookmark
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('opens modal on add bookmark button click', () => {
    render(<BookmarkList {...defaultProps} />);
    const addBookmarkButton = screen.getByLabelText('Add Bookmark');
    fireEvent.click(addBookmarkButton);
    expect(screen.getByText('Add new Bookmark')).toBeInTheDocument();
  });

  test('adds a new bookmark', () => {
    render(<BookmarkList {...defaultProps} />);
    const addBookmarkButton = screen.getByLabelText('Add Bookmark');
    fireEvent.click(addBookmarkButton);
    fireEvent.change(screen.getByPlaceholderText('New Name'), { target: { value: 'Test Bookmark' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
  });

  test('does not add a bookmark with duplicate name', () => {
    render(<BookmarkList {...defaultProps} />);
    const addBookmarkButton = screen.getByLabelText('Add Bookmark');
    fireEvent.click(addBookmarkButton);
    fireEvent.change(screen.getByPlaceholderText('New Name'), { target: { value: 'Test Bookmark' } });
    fireEvent.click(screen.getByText('Save'));

    fireEvent.click(addBookmarkButton);
    fireEvent.change(screen.getByPlaceholderText('New Name'), { target: { value: 'Test Bookmark' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getAllByText('Test Bookmark').length).toBe(1);
  });

  test('deletes a bookmark', () => {
    render(<BookmarkList {...defaultProps} />);
    const addBookmarkButton = screen.getByLabelText('Add Bookmark');
    fireEvent.click(addBookmarkButton);
    fireEvent.change(screen.getByPlaceholderText('New Name'), { target: { value: 'Test Bookmark' } });
    fireEvent.click(screen.getByText('Save'));

    const deleteBookmarkButton = screen.getByLabelText('Delete Bookmark');
    fireEvent.click(deleteBookmarkButton);
    expect(screen.queryByText('Test Bookmark')).not.toBeInTheDocument();
  });

  test('selects a bookmark', () => {
    render(<BookmarkList {...defaultProps} />);
    const addBookmarkButton = screen.getByLabelText('Add Bookmark');
    fireEvent.click(addBookmarkButton);
    fireEvent.change(screen.getByPlaceholderText('New Name'), { target: { value: 'Test Bookmark' } });
    fireEvent.click(screen.getByText('Save'));

    fireEvent.click(screen.getByText('Test Bookmark'));
    expect(mockHandleSearch).toHaveBeenCalledWith({
      lng: 10,
      lat: 20,
      zoom: 5,
      view: 'default-b',
      date: '2023-10-01'
    });
    expect(mockSetBookmark).toHaveBeenCalledWith('Test Bookmark');
  });
});