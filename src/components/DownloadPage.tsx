import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Book } from '../types/Book';
import { bookService } from '../services/bookService';
import { storageService } from '../services/storageService';
import Navbar from './Navbar';
import { Download, ArrowLeft, DollarSign, Calendar, User, FileText, Image } from 'lucide-react';

const DownloadPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const loadBook = async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      const bookData = await bookService.getBookById(bookId);
      setBook(bookData);
      setError('');
    } catch (err: any) {
      setError('Failed to load book details. Please try again.');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!book || !book.file_url || !book.file_name) {
      setError('No file available for download');
      return;
    }

    try {
      setDownloading(true);
      await storageService.downloadFile(book.file_url, book.file_name);
    } catch (err: any) {
      setError('Failed to download file. Please try again.');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = ['primary', 'success', 'info', 'warning', 'secondary', 'danger'];
    const index = category.length % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <Alert variant="danger">
            Book not found. Please check the URL and try again.
          </Alert>
          <Button variant="primary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="me-2" />
            Back to Store
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container className="py-4">
        <Button 
          variant="outline-secondary" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="me-2" />
          Back to Store
        </Button>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row>
          <Col lg={4}>
            <Card className="mb-4">
              {book.image_url ? (
                <Card.Img 
                  variant="top" 
                  src={book.image_url} 
                  alt={book.name}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: '400px' }}
                >
                  <Image size={64} className="text-muted" />
                </div>
              )}
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <Card.Body>
                <div className="mb-3">
                  <Badge bg={getCategoryColor(book.category)} className="mb-2">
                    {book.category}
                  </Badge>
                  <h1 className="h2 mb-3">{book.name}</h1>
                </div>

                <div className="mb-4">
                  <h5 className="text-muted mb-2">Description</h5>
                  <p className="lead">{book.description}</p>
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <DollarSign size={20} className="text-success me-2" />
                      <div>
                        <strong className="h4 text-success mb-0">{formatPrice(book.price)}</strong>
                        <div className="text-muted small">Price</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <Calendar size={20} className="text-info me-2" />
                      <div>
                        <strong>{new Date(book.created_at).toLocaleDateString()}</strong>
                        <div className="text-muted small">Published</div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {book.file_url && (
                  <div className="mb-4">
                    <h5 className="text-muted mb-3">File Information</h5>
                    <div className="d-flex align-items-center mb-2">
                      <FileText size={16} className="text-primary me-2" />
                      <span><strong>Filename:</strong> {book.file_name || 'Unknown'}</span>
                    </div>
                    {book.file_size && (
                      <div className="d-flex align-items-center mb-3">
                        <FileText size={16} className="text-primary me-2" />
                        <span><strong>File Size:</strong> {formatFileSize(book.file_size)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="d-grid">
                  {book.file_url ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {downloading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={20} className="me-2" />
                          Download Book
                        </>
                      )}
                    </Button>
                  ) : (
                    <Alert variant="warning">
                      <FileText size={16} className="me-2" />
                      No file available for download
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DownloadPage;