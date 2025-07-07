# Book Store Application

A modern web application for buying, selling, and managing digital books. Built with React, TypeScript, and Supabase.

## Features

### 🏪 Public Store
- **Browse Books**: View all available books from all authors
- **Search & Filter**: Find books by title, description, category, and price range
- **Book Details**: Click on any book to view detailed information
- **Download**: Purchase and download books directly

### ✍️ Writers Dashboard
- **Publish Books**: Upload your books with cover images and files
- **Manage Inventory**: Edit, update, or delete your published books
- **Analytics**: View statistics about your book collection
- **File Management**: Upload book files (PDF, EPUB, DOCX) and cover images

### 🔐 Authentication
- **User Registration**: Create an account with email and password
- **Secure Login**: JWT-based authentication via Supabase
- **Protected Routes**: Writers dashboard requires authentication
- **User Profiles**: Personalized experience with user metadata

## How It Works

### For Readers/Buyers

1. **Browse the Store**
   - Visit the homepage to see all available books
   - Use search and filters to find specific books
   - View book covers, descriptions, and prices

2. **View Book Details**
   - Click on any book to go to its detail page
   - See full description, file information, and pricing
   - Preview book cover in full size

3. **Download Books**
   - Click "Download Book" button on the detail page
   - File will be automatically downloaded to your device
   - Support for various file formats (PDF, EPUB, DOCX, etc.)

### For Writers/Authors

1. **Access Writers Dashboard**
   - Create an account or log in
   - Navigate to "Writers Dashboard" from the top menu
   - Only authenticated users can access this area

2. **Publish a New Book**
   - Click "Add Book" button
   - Fill in book details (title, category, price, description)
   - Upload a cover image (JPG, PNG, GIF)
   - Upload the book file (PDF, EPUB, DOCX, etc.)
   - Submit to publish

3. **Manage Your Books**
   - View all your published books in the dashboard
   - Edit book details, update files, or change pricing
   - Delete books you no longer want to sell
   - View statistics about your collection

## Technical Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **React Router** for navigation
- **Bootstrap 5** with custom CSS for responsive design
- **Lucide React** for modern icons
- **Vite** for fast development and building

### Backend
- **Supabase** for database, authentication, and file storage
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Auth** for user management
- **Supabase Storage** for file and image hosting

### Database Schema

#### Books Table
- `id`: Unique identifier (UUID)
- `name`: Book title
- `category`: Book category/genre
- `price`: Book price in USD
- `description`: Book description
- `user_id`: Author/owner ID (foreign key)
- `image_url`: Cover image URL
- `file_url`: Book file URL
- `file_name`: Original filename
- `file_size`: File size in bytes
- `created_at`: Publication timestamp
- `updated_at`: Last modification timestamp

### Security Features

#### Row Level Security (RLS)
- **Public Read**: Anyone can view books in the store
- **Authenticated Write**: Only logged-in users can create books
- **Owner Only**: Users can only edit/delete their own books

#### File Storage Security
- **Separate Buckets**: Images and files stored in different buckets
- **Public Access**: Book covers are publicly accessible
- **Secure Downloads**: Book files are served through secure URLs

## File Upload System

### Supported File Types
- **Images**: JPG, PNG, GIF for book covers
- **Books**: PDF, EPUB, DOCX, TXT, and other document formats

### Storage Structure
```
book-images/
  ├── {bookId}-{timestamp}.jpg
  └── {bookId}-{timestamp}.png

book-files/
  ├── {bookId}-{timestamp}.pdf
  └── {bookId}-{timestamp}.epub
```

### Upload Process
1. Files are uploaded to Supabase Storage buckets
2. Unique filenames prevent conflicts
3. Public URLs are generated for access
4. File metadata is stored in the database

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstore-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Set up the database schema using the migration files
   - Create storage buckets: `book-images` and `book-files`
   - Configure bucket policies for public access

4. **Environment Variables**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

### Database Setup

Run the migration files in your Supabase SQL editor:
1. `supabase/migrations/20250707182058_dawn_garden.sql` - Initial schema
2. `supabase/migrations/add_file_storage_support.sql` - File storage support

### Storage Bucket Setup

In your Supabase dashboard:
1. Go to Storage section
2. Create two buckets:
   - `book-images` (public)
   - `book-files` (public)
3. Set appropriate policies for public read access

## User Roles & Permissions

### Anonymous Users
- Browse the public store
- View book details
- Download books (no purchase flow implemented)

### Authenticated Users
- All anonymous user capabilities
- Access to Writers Dashboard
- Upload and manage their own books
- Edit/delete their published books

## Future Enhancements

- Payment integration for book purchases
- User reviews and ratings
- Book categories management
- Advanced search with full-text search
- Author profiles and following system
- Book recommendations
- Sales analytics for authors
- Bulk upload functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.