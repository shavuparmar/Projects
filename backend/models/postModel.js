const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  caption: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
