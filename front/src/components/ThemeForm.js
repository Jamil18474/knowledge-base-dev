import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ThemeForm = ({token}) => {
    const { id } = useParams(); // Récupérer l'ID du thème depuis l'URL
    const navigate = useNavigate();
    const [name, setName] = useState('');

useEffect(() => {
    if (id) {
        const fetchTheme = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/themes/${id}`);
                setName(response.data.name);
              alert( response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du thème:', error);
                // Vous pouvez gérer l'erreur ici, par exemple en redirigeant ou en affichant un message
            }
        };
        fetchTheme();
    }
}, [id]);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (id) {
            // Mise à jour du thème
            await axios.put(`http://localhost:5000/api/themes/${id}`, { name },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
        } else {
            // Création d'un nouveau thème
            await axios.post('http://localhost:5000/api/themes', { name },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
        }
        setName('');
        navigate('/themes'); // Rediriger vers la liste des thèmes
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du thème:', error);
        // Vous pouvez gérer l'erreur ici, par exemple en affichant un message
    }
};

return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>{id ? 'Modifier le Thème' : 'Créer un Nouveau Thème'}</h2>
        <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name">Nom du Thème</label>
            <input
                id="name"
                type="text"
                placeholder="Nom du Thème"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', maxWidth: '400px', padding: '8px', marginTop: '5px' }}
            />
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>
            {id ? 'Modifier le Thème' : 'Ajouter le Thème'}
        </button>
    </form>
);
};

export default ThemeForm;
