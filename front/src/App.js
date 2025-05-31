import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import Chatbot from './components/Chatbot';
import ArticleForm from './components/ArticleForm';
import ThemeForm from './components/ThemeForm';
import ThemeList from './components/ThemeList';
import Signup from './components/Signup';
import Login from './components/Login';
import Favorites from './components/Favorites';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
        } else {
            localStorage.removeItem('token');
            setUserRole('');
        }
    }, [token]);

    const handleLogout = () => {
        setToken('');
    };

    return (
        <Router>
            <div>
                <h1>Base de Connaissances en Développement Informatique</h1>
                <nav>
                    <Link to="/" className="nav-link">Accueil</Link>
                    {userRole === 'admin' && <Link to="/create-article" className="nav-link">Créer un Article</Link>}
                    {userRole === 'admin' && <Link to="/create-theme" className="nav-link">Créer un Thème</Link>}
                    {userRole === 'admin' && <Link to="/themes" className="nav-link">Liste des Thèmes</Link>}
                    {token && <Link to="/favorites" className="nav-link">Favoris</Link>}
                    {!token ? (
                        <>
                            <Link to="/signup" className="nav-link">S'inscrire</Link>
                            <Link to="/login" className="nav-link">Se connecter</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout}>Se déconnecter</button>
                    )}
                </nav>
                <Routes>
                    <Route path="/" element={
                        <>
                            <ArticleList token={token} userRole = {userRole} />
                        </>
                    } />
                    <Route path="/create-article" element={<ArticleForm token={token} />} />
                    <Route path="/edit-article/:id" element={<ArticleForm token={token} />} />
                    <Route path="/create-theme" element={<ThemeForm token={token} />} />
                    <Route path="/edit-theme/:id" element={<ThemeForm token={token} />} />
                    <Route path="/themes" element={<ThemeList token={token} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/favorites" element={<Favorites token={token} />} />
                </Routes>
                <Chatbot />
            </div>
        </Router>
    );
};

export default App;


