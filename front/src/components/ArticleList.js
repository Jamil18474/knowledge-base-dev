import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArticleList = ({ token, userRole }) => {
    const [articles, setArticles] = useState([]);
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Charger les thèmes
    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/themes');
                setThemes(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchThemes();
    }, []);

    // Charger les articles en fonction du thème sélectionné
    useEffect(() => {
        const fetchArticles = async () => {
            if (selectedTheme) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/articles/theme/${selectedTheme}`);
                    setArticles(response.data);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setArticles([]);
            }
        };
        fetchArticles();
    }, [selectedTheme]);

    // Charger les favoris de l'utilisateur
    useEffect(() => {
        const fetchFavorites = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/users/favorites', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFavorites(response.data.map(article => article._id));
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchFavorites();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(articles.filter(article => article._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavorite = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/users/favorites', { articleId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites([...favorites, id]);
            alert('Article ajouté aux favoris');
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div>
            {/* Menu de filtres par thèmes */}
            <div style={{ marginBottom: '10px' }}>
                <h3>Thèmes disponibles :</h3>
                {themes.map((theme) => (
                    <button key={theme._id} onClick={() => setSelectedTheme(theme._id)}>
                        {theme.name}
                    </button>
                ))}
            </div>
            {/* Liste des articles */}
            {selectedTheme && articles.length === 0 ? (
                <p>Aucun article à afficher pour ce thème.</p>
            ) : (
                articles.map((article) => (
                    <div key={article._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h4>{article.title}</h4>
                        <p>{article.content.substring(0, 100)}...</p>
                        {userRole === 'admin' && (
                            <>
                                <Link to={`/edit-article/${article._id}`}>Modifier</Link>
                                <button onClick={() => handleDelete(article._id)}>Supprimer</button>
                            </>
                        )}
                        {token && (
                            <>
                                {!favorites.includes(article._id) ? (
                                    <button onClick={() => handleFavorite(article._id)}>Ajouter aux Favoris</button>
                                ) : (
                                    <p>Article déjà dans vos favoris.</p>
                                )}
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ArticleList;



