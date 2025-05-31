const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const Article = require('../models/Article');
const authorize = require("../middleware/authorize");

// Récupérer tous les thèmes avec leurs articles associés
router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find().populate('articles'); // Remplacez 'articles' par le nom du champ dans le modèle Theme si nécessaire
        res.json(themes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer un thème par ID
router.get('/:id', async (req, res) => {
    try {
        const theme = await Theme.findById(req.params.id).populate('articles');
        if (!theme) {
            return res.status(404).json({ message: 'Thème non trouvé' });
        }
        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ajouter un nouveau thème
router.post('/', authorize(['admin']),async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Le nom du thème est requis.' });
    }
    const newtheme = new Theme({ name });
    try {
        const updatedTheme = await newTheme.save();
        res.status(201).json(updatedTheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Modifier un thème
router.put('/:id', authorize(['admin']),async (req, res) => {
    const { name } = req.body;

    // Vérification de la présence du nom
    if (!name) {
        return res.status(400).json({ message: 'Le nom du thème est requis.' });
    }

    try {
        // Vérifier si le thème existe
        const themeExists = await Theme.findById(id);
        if (!themeExists) {
            return res.status(404).json({ message: 'Thème non trouvé.' });
        }

        theme.name = name;

        const updatedTheme = await theme.save();
        res.json(updatedTheme);

    } catch (error) {
        // Gestion des erreurs
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un thème
router.delete('/:id',authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le thème existe
        const themeExists = await Theme.findById(id);
        if (!themeExists) {
            return res.status(404).json({ message: 'Thème non trouvé.' });
        }

        // Supprimer tous les articles associés au thème
        await Article.deleteMany({ theme: id });

         await Theme.findByIdAndDelete(id);
        res.json({ message: 'Thème supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
