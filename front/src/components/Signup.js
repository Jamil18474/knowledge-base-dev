import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', { username, password });
            alert('Inscription réussie !');
            setUsername('');
            setPassword('');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'inscription.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <div>
                <label>Nom d'utilisateur</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">S'inscrire</button>
        </form>
    );
};

export default Signup;
