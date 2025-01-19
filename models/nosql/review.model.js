const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  reviews: [
    {
      username: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Review", ReviewSchema);
