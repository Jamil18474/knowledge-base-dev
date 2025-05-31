const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assurez-vous d'importer votre modèle User
const authorize = require('../middleware/authorize'); // Middleware d'autorisation

// Récupérer les articles favoris de l'utilisateur
router.get('/favorites', authorize(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ajouter un article aux favoris
router.post('/favorites', authorize(['admin', 'user']), async (req, res) => {
    const { articleId } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.favorites.push(articleId);
        await user.save();
        res.status(200).json({ message: 'Article ajouté aux favoris' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer un article des favoris
router.delete('/favorites/:articleId', authorize(['admin', 'user']), async (req, res) => {
    const { articleId } = req.params;
    try {
        const user = await User.findById(req.user._id);
        user.favorites.pull(articleId); // Retirer l'article des favoris
        await user.save();
        res.status(200).json({ message: 'Article supprimé des favoris' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
