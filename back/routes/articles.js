const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Theme = require('../models/Theme');





// Récupérer tous les articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().populate('theme'); // Utilisez populate pour obtenir les détails du thème
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Récupérer les articles par thème
router.get('/theme/:themeId', async (req, res) => {
    const { themeId } = req.params;
    try {
        const articles = await Article.find({ theme: themeId }).populate('theme'); // Utilisez populate pour obtenir les détails du thème
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Ajouter un nouvel article
router.post('/', async (req, res) => {
    const { title, content, themeId } = req.body;

    // Vérifier que le titre et le contenu ne sont pas vides
    if (!title || !content) {
        return res.status(400).json({ message: 'Le titre et le contenu sont requis.' });
    }

    // Vérifier si le thème existe
    try {
        const themeExists = await Theme.findById(themeId);
        if (!themeExists) {
            return res.status(400).json({ message: 'Le thème avec cet ID n\'existe pas.' });
        }

        const newArticle = new Article({ title, content, theme: themeId });
        const savedArticle = await newArticle.save();

        // Ajouter l'article au thème
        themeExists.articles.push(savedArticle._id);
        await themeExists.save();

        res.status(201).json(savedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mettre à jour un article
router.put('/:id', async (req, res) => {
    const { title, content, themeId } = req.body;

    // Vérification de la présence du titre et du contenu
    if (!title || !content) {
        return res.status(400).json({ message: 'Le titre et le contenu sont requis.' });
    }

    try {
        // Trouver l'article à mettre à jour
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé.' });
        }

        // Vérifier si le thème existe
        if (themeId) {
            const newTheme = await Theme.findById(themeId);
            if (!newTheme) {
                return res.status(400).json({ message: 'Le thème avec cet ID n\'existe pas.' });
            }
        }

        // Vérifier si le thème a changé
        if (themeId && themeId !== article.theme.toString()) {
            // Retirer l'article de l'ancien thème
            const oldTheme = await Theme.findById(article.theme);
            if (oldTheme) {
                oldTheme.articles.pull(article._id); // Retirer l'article de l'ancien thème
                await oldTheme.save();
            }

            // Ajouter l'article au nouveau thème
            const newTheme = await Theme.findById(themeId);
            newTheme.articles.push(article._id); // Ajouter l'article au nouveau thème
            await newTheme.save();
        }

        // Mettre à jour l'article
        article.title = title;
        article.content = content;
        article.theme = themeId || article.theme; // Mettre à jour le thème si fourni

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Supprimer un article
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Trouver l'article à supprimer
        const deletedArticle = await Article.findById(id);
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        // Retirer l'article de son thème
        const theme = await Theme.findById(deletedArticle.theme);
        if (theme) {
            theme.articles.pull(deletedArticle._id); // Retirer l'article de la liste des articles du thème
            await theme.save(); // Sauvegarder les modifications du thème
        }

        // Supprimer l'article
        await Article.findByIdAndDelete(id);
        res.json({ message: 'Article supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
