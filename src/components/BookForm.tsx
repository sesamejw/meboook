import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/Book';
import { bookService } from '../services/bookService';
import { storageService } from '../services/storageService';
import { BookOpen, DollarSign, Tag, FileText, Upload, Image } from 'lucide-react';

interface BookFormProps {
  show: boolean;
  onHide: () => void;
  book?: Book | null;
  onSave: () => void;
}

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

  useEffect(() => {
    if (book) {
      setFormData({
        name: book.name,
        category: book.category,
        price: book.price.toString(),
        description: book.description,
      });
      setImagePreview(book.image_url || '');
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
    setBookFile(null);
    setError('');
  }, [book, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
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
      }

      let imageUrl = book?.image_url || '';
      let fileUrl = book?.file_url || '';
      let fileName = book?.file_name || '';
      let fileSize = book?.file_size || 0;

      // Generate a temporary ID for new books
      const tempId = book?.id || `temp-${Date.now()}`;

      // Upload image if provided
      if (imageFile) {
        imageUrl = await storageService.uploadBookImage(imageFile, tempId);
      }

      // Upload file if provided
      if (bookFile) {
        const fileData = await storageService.uploadBookFile(bookFile, tempId);
        fileUrl = fileData.url;
        fileName = fileData.fileName;
        fileSize = fileData.fileSize;
      }
      if (book) {
        // Update existing book
        const updateData: UpdateBookRequest = {
          id: book.id,
          name: formData.name.trim(),
          category: formData.category,
          price: price,
          description: formData.description.trim(),
          image_url: imageUrl,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        };
        await bookService.updateBook(updateData);
      } else {
        // Create new book
        const createData: CreateBookRequest = {
          name: formData.name.trim(),
          category: formData.category,
          price: price,
          description: formData.description.trim(),
          image_url: imageUrl,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        };
        await bookService.createBook(createData);
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            {book?.file_name && !bookFile && (
              <div className="mt-2">
                <small className="text-success">
                  Current file: {book.file_name}
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