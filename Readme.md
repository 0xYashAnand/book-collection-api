# Book Collection API

This project is a web-based API that allows users to manage their personal book collection. The API uses both MySQL and NoSQL (MongoDB) databases to store book records and user data. It also integrates with external APIs, such as the Open Library API, to fetch additional book information based on ISBN.

## Features

- **User Authentication**: Secure login and JWT-based authentication.
- **CRUD Operations for Books**: Add, edit, delete, and fetch books in a user's collection.
- **ISBN Lookup**: Fetch additional book details from the Open Library API based on ISBN.
- **Hybrid Database**: MySQL for relational data storage (book records) and MongoDB for additional data storage needs.
- **Multi-User Support**: Each user manages their own book collection independently.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/book-collection-api.git
   cd book-collection-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following configuration:

   ```
   JWT_SECRET="your_jwt_secret_key"
   MYSQL_HOST="localhost"
   MYSQL_USER="root"
   MYSQL_PASSWORD="your_mysql_password"
   MYSQL_DATABASE="book_collection"
   MONGODB_URI=mongodb://localhost:27017/book_collection_db
   ```

4. Set up MySQL and MongoDB:
   - Ensure you have MySQL and MongoDB running locally or configure the respective services to use a remote instance.
   - Create the database in MySQL if not already created.

5. Run the server:

   ```bash
   npm run dev
   ```

   This will start the server in development mode using `nodemon`.

## API Endpoints

### Authentication

- **POST** `/auth/register`:
  - Register a new user.
    - Body: `{ "email": "user@example.com", "password": "your_password" }`
- **POST** `/auth/login`: 
  - Log in an existing user and receive a JWT token.
    - Body: `{ "email": "user@example.com", "password": "your_password" }`
  - Response: `{ "token": "your_jwt_token" }`

### Books

- **GET** `/books`: Fetch all books in the collection for the logged-in user.
- **POST** `/books`: Add a new book to the collection.
  - Body: 
    ```json
    {
      "title": "Book Title",
      "author": "Book Author",
      "rating": 5,
      "notes": "Some notes about the book",
      "read_status": "Read, Unread or In Progress",
      "isbn": "9780140328721",
      "cover_image": "http://example.com/cover.jpg"
    }
    ```
- **GET** `/books/isbn/:isbn`: Fetch additional information for a book by ISBN from Open Library API.
- **PUT** `/books/:id`: Update an existing book.
  - Body: Same as the `POST` request.
- **DELETE** `/books/:id`: Delete a book from the collection.

### Middleware

- **Authentication Middleware**: Ensures that all routes except for authentication require a valid JWT token. 

## Technologies Used

- **Backend**: Node.js, Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MySQL (via Sequelize ORM), MongoDB (for additional storage)
- **External API**: Open Library API for ISBN-based book lookup
- **Development Tools**: Nodemon for automatic server restarts

## Project Setup

1. **Start the server**:

   ```bash
   npm run dev
   ```

2. **Test API with Postman**:
   - Send a `POST` request to `/auth/login` to get the JWT token.
   - Use the token to authenticate requests to other routes by including it in the `Authorization` header:
     ```
     Authorization: Bearer <your_jwt_token>
     ```

## Development Notes

- Ensure you have MySQL and MongoDB configured correctly in your environment for smooth operation.
- Modify the `.env` file for any specific configurations, including the JWT secret key and database credentials.
- External APIs (like Open Library) can be extended in the future for more detailed book information.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
