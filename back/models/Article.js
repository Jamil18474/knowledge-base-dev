const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true },
});

module.exports = mongoose.model('Article', articleSchema);
