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
      sortBy = "createdAt", // Default sort field
      sortOrder = "DESC", // Default sort order (DESC or ASC)
    } = req.query;

    const offset = (page - 1) * limit;

    // Import Sequelize operators
    const { Op } = require("sequelize");

    // Construct the filter conditions
    const whereConditions = { userId: req.user.id };

    // Add search filters
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { notes: { [Op.like]: `%${search}%` } }, // Add notes search if applicable
      ];
    }

    // Add category filter
    if (category !== "all") {
      whereConditions.category = category;
    }

    // Add read status filter
    if (read_status !== "all") {
      whereConditions.read_status = read_status;
    }

    // Fetch the books with filters, pagination, and sorting
    const books = await Book.findAndCountAll({
      where: whereConditions,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [[sortBy, sortOrder.toUpperCase()]], // Dynamic sorting
    });

    // If no books are found, return 404
    if (books.rows.length === 0) {
      return res.status(404).json({ error: "No books found" });
    }

    // Construct paginated response
    const totalPages = Math.ceil(books.count / limit);

    res.status(200).json({
      message: "Books fetched successfully",
      data: books.rows,
      meta: {
        totalRecords: books.count,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
      },
    });
  } catch (error) {
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
      ...response.data,
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

    // check if the book with existing isbn exist for the same user or not if exist then return error
    const existingBook = await Book.findOne({
      where: { isbn, userId: req.user.id },
    });
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
      "Fantasy",
      "Romance",
      "Thriller",
      "Horror",
      "Biography",
      "History",
      "Self-Help",
      "Young Adult",
      "Children's",
      "Graphic Novel",
      "Cookbook",
      "Travel",
      "True Crime",
      "Health & Fitness",
      "Business",
      "Poetry",
    ];
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
    res.status(500).json({ error: "Failed to add book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      rating,
      notes,
      read_status,
      isbn,
      cover_image,
      wishlist,
      category,
    } = req.body;

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
    if (wishlist !== undefined) updatedFields.wishlist = wishlist;
    if (cover_image) updatedFields.cover_image = cover_image;

    // If category is provided, validate it
    const allowedCategories = [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Sci-Fi",
      "Fantasy",
      "Romance",
      "Thriller",
      "Horror",
      "Biography",
      "History",
      "Self-Help",
      "Young Adult",
      "Children's",
      "Graphic Novel",
      "Cookbook",
      "Travel",
      "True Crime",
      "Health & Fitness",
      "Business",
      "Poetry",
    ];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        error: `category must be one of: ${allowedCategories.join(", ")}`,
      });
    }
    if (category) updatedFields.category = category; // Update category/genre
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
    res.status(500).json({ error: "Failed to delete book" });
  }
};
