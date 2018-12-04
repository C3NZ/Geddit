const mongoose = require('mongoose');

// Import the schema class from mongoose
const { Schema } = mongoose;

// Create the comment schema
const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
