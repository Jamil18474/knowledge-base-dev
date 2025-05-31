import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ThemeList = ({ token }) => {
    const [themes, setThemes] = useState([]);

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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/themes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setThemes(themes.filter(theme => theme._id !== id)); // Mettre à jour la liste des thèmes
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Liste des Thèmes</h2>
            {themes.map((theme) => (
                <div key={theme._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h4>{theme.name}</h4>
                    <Link to={`/edit-theme/${theme._id}`}>Modifier</Link>
                    <button onClick={() => handleDelete(theme._id)} style={{ marginLeft: '10px' }}>
                        Supprimer
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ThemeList;


