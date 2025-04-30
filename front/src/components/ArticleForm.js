import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ArticleForm = () => {
    const { id } = useParams(); // Récupérer l'ID de l'article depuis l'URL
    const navigate = useNavigate(); // Utiliser useNavigate à la place de useHistory
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('');

    useEffect(() => {
        const fetchThemes = async () => {
            const response = await axios.get('http://localhost:5000/api/themes');
            setThemes(response.data);
        };
        fetchThemes();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setSelectedTheme(response.data.theme._id);
            };
            fetchArticle();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newArticle = { title, content, themeId: selectedTheme };
        if (id) {
            await axios.put(`http://localhost:5000/api/articles/${id}`, newArticle);
        } else {
            await axios.post('http://localhost:5000/api/articles', newArticle);
        }
        // Réinitialiser les champs et rediriger
        setTitle('');
        setContent('');
        setSelectedTheme('');
        navigate('/'); // Rediriger vers la liste des articles
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>{id ? 'Modifier l\'Article' : 'Créer un Nouvel Article'}</h2>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="title">Titre</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', maxWidth: '400px', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="content">Contenu</label>
                <textarea
                    id="content"
                    placeholder="Contenu"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ width: '100%', maxWidth: '400px', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="theme">Thème</label>
                <select
                    id="theme"
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    required
                    style={{ width: '100%', maxWidth: '400px', padding: '8px', marginTop: '5px' }}
                >
                    <option value="">Sélectionnez un thème</option>
                    {themes.map((theme) => (
                        <option key={theme._id} value={theme._id}>
                            {theme.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" style={{ padding: '10px 15px' }}>
                {id ? 'Modifier l\'Article' : 'Ajouter l\'Article'}
            </button>
        </form>
    );
};

export default ArticleForm;
