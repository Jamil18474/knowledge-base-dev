const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assurez-vous d'importer votre modèle User

const createAdmin = async () => {
    try {
        // Vérifier si un administrateur existe déjà
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            // Créer un administrateur par défaut
            const hashedPassword = await bcrypt.hash('adminPassword', 10); // Remplacez 'adminPassword' par le mot de passe souhaité
            const adminUser = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Administrateur par défaut créé');
        } else {
            console.log('L\'administrateur existe déjà');
        }
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur :', error);
    }
};

module.exports = createAdmin;
