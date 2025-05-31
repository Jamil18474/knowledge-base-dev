const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const createAdmin = require('./initAdmin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected');
        await createAdmin(); // Appeler la fonction pour créer l'administrateur
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Route pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des thèmes et articles');
});

// Routes
app.use('/api/themes', require('./routes/themes'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on <http://localhost>:${PORT}`);
});
