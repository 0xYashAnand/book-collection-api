const axios = require("axios");
const { Book } = require("../models/mysql");

exports.getBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      read_status = "",
    } = req.query;
    const offset = (page - 1) * limit;

    // Construct the filter conditions
    let whereConditions = { userId: req.user.id };

    if (search) {
      whereConditions = {
        ...whereConditions,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    if (category) {
      whereConditions.category = category; // Filter by category/genre
    }

    if (read_status) {
      whereConditions.read_status = read_status; // Filter by read status
    }

    const books = await Book.findAll({
      where: whereConditions,
      offset,
      limit,
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

exports.getBooksById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({ where: { id, userId: req.user.id } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

exports.getISBNBookInfo = async (req, res) => {
  const { isbn } = req.params;

  try {
    const response = await axios.get(
      `https://openlibrary.org/isbn/${isbn}.json`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch book information from external API");
    }

    const bookData = {
      title: response.data.title || "N/A",
      authors: (response.data.contributions || []).join(", "),
      publish_date: response.data.publish_date || "N/A",
      publishers: (response.data.publishers || []).join(", "),
      isbn_10: response.data.isbn_10?.[0] || "N/A",
      isbn_13: response.data.isbn_13?.[0] || "N/A",
      number_of_pages: response.data.number_of_pages || 0,
      first_sentence: response.data.first_sentence?.value || "N/A",
    };

    res.status(200).json(bookData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch book information, try again" });
  }
};

exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      rating,
      notes,
      read_status,
      isbn,
      cover_image,
      category,
      wishlist,
    } = req.body;

    const allowedReadStatus = ["Read", "Unread", "In Progress"];

    if (!title || !author || !isbn) {
      return res
        .status(200)
        .json({ message: null, error: "Title, author, and ISBN are required" });
    }

    // check if the book with existing isbn exist or not if exist then return error
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res
        .status(200)
        .json({ message: null, error: "Book with this ISBN already exists" });
    }

    if (!allowedReadStatus.includes(read_status)) {
      return res.status(200).json({
        message: null,
        error: `read_status must be one of: ${allowedReadStatus.join(", ")}`,
      });
    }

    // If category is provided, validate it
    const allowedCategories = [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Sci-Fi",
      "Biography",
      "History",
    ]; // Example categories
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        error: `category must be one of: ${allowedCategories.join(", ")}`,
      });
    }

    const book = await Book.create({
      title,
      author,
      rating,
      notes,
      read_status,
      isbn,
      cover_image,
      category, // Added category/genre
      wishlist: wishlist || false, // Added wishlist flag
      userId: req.user.id,
    });

    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, rating, notes, read_status, isbn, cover_image } =
      req.body;

    // Find the book to update
    const book = await Book.findOne({ where: { id, userId: req.user.id } });
    if (!book) {
      return res.status(200).json({ message: null, error: "Book not found" });
    }

    // Update only provided fields (partial update)
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (author) updatedFields.author = author;
    if (rating !== undefined) updatedFields.rating = rating; // Handle nullish values
    if (notes) updatedFields.notes = notes;
    if (read_status) {
      const allowedReadStatus = ["Read", "Unread", "In Progress"];
      if (!allowedReadStatus.includes(read_status)) {
        return res.status(200).json({
          message: null,
          error: `read_status must be one of: ${allowedReadStatus.join(", ")}`,
        });
      }
      updatedFields.read_status = read_status;
    }
    if (isbn) updatedFields.isbn = isbn;
    if (cover_image) updatedFields.cover_image = cover_image;

    // Update the book with the filtered fields
    await book.update(updatedFields);

    // Reload the book to include updated data (optional)
    const updatedBook = await Book.findByPk(id);

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook || book,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the book exists and belongs to the user
    const book = await Book.findOne({ where: { id, userId: req.user.id } });
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Authorization check: Only the owner can delete the book
    if (book.userId !== req.user.id) {
      return res
        .status(200)
        .json({ message: null, error: "Unauthorized to delete book" });
    }

    await book.destroy({ force: true });
    res.status(200).json({ message: "Book deleted successfully", error: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};
