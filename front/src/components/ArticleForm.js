import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ArticleForm = ({ token }) => {
    const { id } = useParams(); // Récupérer l'ID de l'article depuis l'URL
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [themeId, setThemeId] = useState('');
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/themes');
                setThemes(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des thèmes:', error);
            }
        };

        const fetchArticle = async () => {
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setThemeId(response.data.theme._id); // Assurez-vous que le thème est correctement récupéré
                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'article:', error);
                }
            }
        };

        fetchThemes();
        fetchArticle();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Vous devez être connecté en tant qu\'administrateur pour créer ou modifier un article.');
            return;
        }

        try {
            if (id) {
                // Mise à jour de l'article
                await axios.put(`http://localhost:5000/api/articles/${id}`, { title, content, themeId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Création d'un nouvel article
                await axios.post('http://localhost:5000/api/articles', { title, content, themeId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert('Article enregistré avec succès !');
            setTitle('');
            setContent('');
            setThemeId('');
            navigate('/'); // Rediriger vers la liste des articles
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement de l\'article.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? 'Modifier l\'Article' : 'Créer un Article'}</h2>
            <div>
                <label>Titre</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Contenu</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div>
                <label>Thème</label>
                <select value={themeId} onChange={(e) => setThemeId(e.target.value)} required>
                    <option value="">Sélectionnez un thème</option>
                    {themes.map((theme) => (
                        <option key={theme._id} value={theme._id}>
                            {theme.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">{id ? 'Mettre à jour' : 'Créer'}</button>
        </form>
    );
};

export default ArticleForm;
