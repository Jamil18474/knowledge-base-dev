import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const ArticleForm = ({ token, article }) => {
    const [title, setTitle] = useState(article ? article.title : '');
    const [content, setContent] = useState(article ? article.content : '');
    const [themeId, setThemeId] = useState(article ? article.theme : '');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Vous devez être connecté en tant qu\'administrateur pour créer ou modifier un article.');
            return;
        }

        try {
            if (article) {
                // Mise à jour de l'article
                await axios.put(`http://localhost:5000/api/articles/${article._id}`, { title, content, themeId }, {
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
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement de l\'article.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{article ? 'Modifier l\'Article' : 'Créer un Article'}</h2>
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
                <input type="text" value={themeId} onChange={(e) => setThemeId(e.target.value)} required />
            </div>
            <button type="submit">{article ? 'Mettre à jour' : 'Créer'}</button>
        </form>
    );
};

export default ArticleForm;
