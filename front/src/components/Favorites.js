import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favorites = ({ token }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (token) {
            fetchFavorites();
        }
    }, [token]);

    const handleRemoveFavorite = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/favorites/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== id));
            alert('Article supprimé des favoris');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Articles Favoris</h2>
            {favorites.length === 0 ? (
                <p>Aucun article favori.</p>
            ) : (
                favorites.map((article) => (
                    <div key={article._id} style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
                        <h4>{article.title}</h4>
                        <p>{article.content.substring(0, 100)}...</p>
                        <button onClick={() => handleRemoveFavorite(article._id)}>Retirer des Favoris</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorites;
