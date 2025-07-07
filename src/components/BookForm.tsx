import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/Book';
import { bookService } from '../services/bookService';
import { BookOpen, DollarSign, Tag, FileText } from 'lucide-react';

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
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
      });
    }
    setError('');
  }, [book, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

      if (book) {
        // Update existing book
        const updateData: UpdateBookRequest = {
          id: book.id,
          name: formData.name.trim(),
          category: formData.category,
          price: price,
          description: formData.description.trim(),
        };
        await bookService.updateBook(updateData);
      } else {
        // Create new book
        const createData: CreateBookRequest = {
          name: formData.name.trim(),
          category: formData.category,
          price: price,
          description: formData.description.trim(),
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