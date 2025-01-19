const sequelize = require("../../config/database");
const User = require("./user.model");
const Book = require("./book.model");

// Define associations
User.hasMany(Book, { foreignKey: "userId", onDelete: "CASCADE" });
Book.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Book,
};
