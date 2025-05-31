import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setToken(response.data.token); // Stockez le token dans l'état parent ou dans le localStorage
            alert('Connexion réussie !');
            setUsername('');
            setPassword('');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la connexion.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Connexion</h2>
            <div>
                <label>Nom d'utilisateur</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Se connecter</button>
        </form>
    );
};

export default Login;
