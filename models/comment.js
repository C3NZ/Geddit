const mongoose = require('mongoose');

// Import the schema class from mongoose
const { Schema } = mongoose;

// Create the comment schema
const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});


commentSchema.pre('find', function(next) {
    this.populate('replies')
    next();
});

commentSchema.pre('findOne', function(next) {
    this.populate('replies');
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
