const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const Article = require('../models/Article');

// Récupérer tous les thèmes avec leurs articles associés
router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find().populate('articles'); // Remplacez 'articles' par le nom du champ dans le modèle Theme si nécessaire
        res.json(themes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Ajouter un nouveau thème
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Le nom du thème est requis.' });
    }
    const theme = new Theme({ name });
    try {
        const newTheme = await theme.save();
        res.status(201).json(newTheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Modifier un thème
router.put('/:id', async (req, res) => {
    const { id } = req.params;
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

        // Mise à jour du thème
        const updatedTheme = await Theme.findByIdAndUpdate(id, { name }, { new: true });

        // Renvoi du thème mis à jour
        res.json(updatedTheme);
    } catch (error) {
        // Gestion des erreurs
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un thème
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le thème existe
        const themeExists = await Theme.findById(id);
        if (!themeExists) {
            return res.status(404).json({ message: 'Thème non trouvé.' });
        }

        // Supprimer tous les articles associés au thème
        await Article.deleteMany({ theme: id });

        // Supprimer le thème
        const deletedTheme = await Theme.findByIdAndDelete(id);
        res.json({ message: 'Thème supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
