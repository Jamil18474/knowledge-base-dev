// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import Chatbot from './components/Chatbot';
import ArticleForm from './components/ArticleForm';
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Base de Connaissances en Développement Informatique</h1>
                <nav>
                    <Link to="/" className="nav-link">Accueil</Link>
                    <Link to="/create-article" className="nav-link">Créer un Article</Link>
                </nav>
                <Routes>
                    <Route path="/" element={
                        <>
                            <ArticleList />
                            <Chatbot />
                        </>
                    } />
                    <Route path="/create-article" element={<ArticleForm />} />
                    <Route path="/edit-article/:id" element={<ArticleForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

