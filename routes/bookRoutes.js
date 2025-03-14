const express = require("express");
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getISBNBookInfo,
  getBooksById,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Routes for books
router.get("/", getBooks); // Retrieve all books
router.get("/:id", getBooksById); // retrive book by id
router.get("/isbn/:isbn", getISBNBookInfo); // Retrieve book info by ISBN
router.post("/", addBook); // Add a new book
router.patch("/:id", updateBook); // Update a book by ID
router.delete("/:id", deleteBook); // Delete a book by ID

module.exports = router;
