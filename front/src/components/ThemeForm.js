import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ThemeForm = () => {
    const { id } = useParams(); // Récupérer l'ID du thème depuis l'URL
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        if (id) {
            const fetchTheme = async () => {
                const response = await axios.get(`http://localhost:5000/api/themes/${id}`);
                setName(response.data.name);
            };
            fetchTheme();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await axios.put(`http://localhost:5000/api/themes/${id}`, { name });
        } else {
            await axios.post('http://localhost:5000/api/themes', { name });
        }
        setName('');
        navigate('/'); // Rediriger vers la liste des thèmes ou articles
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
