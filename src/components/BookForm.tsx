import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Book, CreateBookRequest, UpdateBookRequest, apiService } from '../services/apiService';
import { BookOpen, DollarSign, Tag, FileText, Upload, Image } from 'lucide-react';

interface BookFormProps {
  show: boolean;
  onHide: () => void;
  book?: Book | null;
  onSave: () => void;
}

/**
 * BookForm Component
 * This component provides a modal form for creating and editing books.
 * It handles file uploads for both book cover images and book files,
 * and communicates with the .NET Core API for data persistence.
 */
const BookForm: React.FC<BookFormProps> = ({ show, onHide, book, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when the modal opens or when editing a book
  useEffect(() => {
    if (book) {
      // Populate form with existing book data for editing
      setFormData({
        name: book.name,
        category: book.category,
        price: book.price.toString(),
        description: book.description,
      });
      setImagePreview(book.imageUrl || '');
    } else {
      // Reset form for creating a new book
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
      });
      setImagePreview('');
    }
    // Reset file inputs and error state
    setImageFile(null);
    setBookFile(null);
    setError('');
  }, [book, show]);

  /**
   * Handle form input changes
   * Updates the form state when user types in input fields
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle image file selection
   * Validates the selected file and creates a preview
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate that the selected file is an image
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        // Create a preview of the selected image
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  /**
   * Handle book file selection
   * Stores the selected book file for upload
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookFile(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Please enter a valid price');
      // Validate price input
      }

      let imageUrl = book?.image_url || '';
      let fileUrl = book?.file_url || '';
      let fileName = book?.file_name || '';
      // Initialize file-related variables with existing values (for updates)
      let imageUrl = book?.imageUrl || '';
      let fileUrl = book?.fileUrl || '';
      let fileName = book?.fileName || '';
      let fileSize = book?.fileSize || 0;

      // Generate a temporary ID for organizing uploaded files
      const tempId = book?.id || undefined;
        imageUrl = await storageService.uploadBookImage(imageFile, tempId);
      // Upload new image if one was selected

        const imageUploadResponse = await apiService.uploadBookImage(imageFile, tempId);
        imageUrl = imageUploadResponse.url;
      if (bookFile) {
        const fileData = await storageService.uploadBookFile(bookFile, tempId);
      // Upload new book file if one was selected
        fileName = fileData.fileName;
        const fileUploadResponse = await apiService.uploadBookFile(bookFile, tempId);
        fileUrl = fileUploadResponse.url;
        fileName = fileUploadResponse.fileName;
        fileSize = fileUploadResponse.size;
        const updateData: UpdateBookRequest = {
          id: book.id,
          name: formData.name.trim(),
        // Update existing book via API
        const updateData: UpdateBookRequest = {
          image_url: imageUrl,
          file_url: fileUrl,
          price,
          file_size: fileSize,
          imageUrl,
          fileUrl,
          fileName,
          fileSize,
        const createData: CreateBookRequest = {
        await apiService.updateBook(book.id, updateData);
          category: formData.category,
        // Create new book via API
          description: formData.description.trim(),
          image_url: imageUrl,
          file_url: fileUrl,
          price,
          file_size: fileSize,
          imageUrl,
          fileUrl,
          fileName,
          fileSize,
      onSave();
        await apiService.createBook(createData);
      setError(err.message || 'Failed to save book. Please try again.');
    } finally {
      // Notify parent component that the operation was successful
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   * Processes the form data, uploads files, and creates/updates the book
   */
  // Predefined list of book categories for the dropdown
  const commonCategories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'History',
    'Science',
    'Technology',
    'Business',
    'Self-Help',
    'Health',
    'Travel',
    'Cooking',
    'Art',
    'Religion',
    'Philosophy',
    'Education',
    'Children',
    'Young Adult',
    'Poetry',
    'Drama',
    'Horror'
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <BookOpen size={24} className="me-2" />
          {book ? 'Edit Book' : 'Add New Book'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <BookOpen size={16} className="me-2" />
              Book Name *
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter book name"
              required
              maxLength={255}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <Tag size={16} className="me-2" />
              Category *
            </Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {commonCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Choose the most appropriate category for your book
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <DollarSign size={16} className="me-2" />
              Price *
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              max="99999.99"
              required
            />
            <Form.Text className="text-muted">
              Enter the price in USD
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <FileText size={16} className="me-2" />
              Description *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              required
              maxLength={1000}
            />
            <Form.Text className="text-muted">
              Provide a brief description of the book's content ({formData.description.length}/1000 characters)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <Image size={16} className="me-2" />
              Book Cover Image
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Form.Text className="text-muted">
              Upload a cover image for your book (JPG, PNG, GIF)
            </Form.Text>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  className="border rounded"
                />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center">
              <Upload size={16} className="me-2" />
              Book File {!book && '*'}
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              required={!book}
            />
            <Form.Text className="text-muted">
              Upload the book file (PDF, EPUB, DOCX, etc.)
            </Form.Text>
            {book?.fileName && !bookFile && (
              <div className="mt-2">
                <small className="text-success">
                  Current file: {book.fileName}
                </small>
              </div>
            )}
            {bookFile && (
              <div className="mt-2">
                <small className="text-info">
                  Selected: {bookFile.name} ({(bookFile.size / 1024 / 1024).toFixed(2)} MB)
                </small>
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {book ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              book ? 'Update Book' : 'Create Book'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookForm;