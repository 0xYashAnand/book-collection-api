const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Book = sequelize.define("Book", {
  id: { type: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: true },
  notes: { type: DataTypes.TEXT },
  read_status: {
    type: DataTypes.ENUM("Read", "Unread", "In Progress"),
    allowNull: false,
  },
  isbn: { type: DataTypes.STRING, allowNull: false },
  cover_image: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, allowNull: true },
  wishlist: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Book;
