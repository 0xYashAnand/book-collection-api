# Book Collection API
This project is a RESTful API for managing personal book collections with user authentication, book management, and integration with external book data sources.. The API uses both MySQL and NoSQL (MongoDB) databases to store book records and user data. It also integrates with external APIs, such as the Open Library API, to fetch additional book information based on ISBN.

## Features

- **User Authentication**: Register, login, and manage user accounts using JWT-based authentication
- **Book Management**: Add, update, delete, and retrieve books in your collection
- **Search & Filtering**: Search books by title, author, or notes with various filters
- **Hybrid Database**: MySQL for relational data storage (book records) and MongoDB for additional data storage needs.
- **ISBN Integration**: Fetch book metadata from OpenLibrary API by ISBN
- **Categorization**: Organize books by categories/genres
- **Reading Status**: Track which books you've read, are reading, or want to read
- **Wishlist**: Flag books you want to acquire

## Technologies

- **Backend**: Node.js with Express
- **Databases**:
  - MySQL/MariaDB (via Sequelize ORM) for user accounts and book data
  - MongoDB (via Mongoose) for reviews and additional metadata
- **Authentication**: JWT (JSON Web Tokens)
- **External APIs**: OpenLibrary for book information
- **Development Tools**: Nodemon for automatic server restarts

## Development Notes

- Ensure you have MySQL and MongoDB configured correctly in your environment for smooth operation.
- Modify the `.env` file for any specific configurations, including the JWT secret key and database credentials.
- External APIs (like Open Library) can be extended in the future for more detailed book information.


## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user details

### Books

- `GET /api/books` - Get all books with pagination, sorting, and filtering
- `GET /api/books/:id` - Get a specific book by ID
- `GET /api/books/isbn/:isbn` - Fetch book information from OpenLibrary by ISBN
- `POST /api/books` - Add a new book to collection
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MySQL Database Configuration
MYSQL_DB=book_collection
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/book_collection

# JWT Configuration
JWT_SECRET=your_secret_key
```

## Installation & Setup

1. Clone the repository:
   ```
   git clone https://github.com/0xyashanand/book-collection-api.git
   cd book-collection-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up databases:
   - Create MySQL database and configure in `.env`
   - Set up MongoDB connection in `.env`

4. Run migrations (if applicable)

5. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## Book Fields

| Field | Description |
|-------|-------------|
| title | Book title |
| author | Book author(s) |
| rating | User rating (0-5 scale) |
| notes | User notes or review |
| read_status | "Read", "Unread", or "In Progress" |
| isbn | ISBN-10 or ISBN-13 identifier |
| cover_image | URL to book cover image |
| category | Genre or category (Fiction, Non-Fiction, etc.) |
| wishlist | Boolean indicating if book is on wishlist |

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Crafted with ❤️ by Yash Anand**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/0xyashanand)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/0xyashanand)
[![Website](https://img.shields.io/badge/Website-Visit-14a1f0?style=flat&logo=google-chrome)](https://yashanand.live)
[![Email](https://img.shields.io/badge/Email-Contact-d14836?style=flat&logo=gmail)](mailto:0xyashanand@gmail.com)
