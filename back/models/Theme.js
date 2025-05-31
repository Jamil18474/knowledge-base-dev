const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Référence aux articles
});

module.exports = mongoose.model('Theme', themeSchema);