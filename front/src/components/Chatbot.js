import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [step, setStep] = useState(0);
    const [messages, setMessages] = useState([]);
    const [articles, setArticles] = useState([]);
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        const fetchThemes = async () => {
            const response = await axios.get('http://localhost:5000/api/themes');
            setThemes(response.data);
        };
        fetchThemes();
    }, []);

    const handleThemeSelect = async (theme) => {
        const userMessage = { text: `Je veux en savoir plus sur le thème ${theme.name}`, sender: 'user' };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.get(`http://localhost:5000/api/articles/theme/${theme._id}`);
            const botMessage = { text: `Voici des articles sur le thème ${theme.name}:`, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setArticles(response.data);
            setStep(1);
        } catch (error) {
            const botMessage = { text: "Désolé, je n'ai trouvé aucun article pour ce thème.", sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
    };

    const handleBack = () => {
        setStep(0);
        setArticles([]); // Réinitialiser les articles
        setMessages([]); // Réinitialiser les messages
    };

    const renderArticles = () => {
        return articles.map((article) => (
            <div key={article._id}>
                <h4>{article.title}</h4>
                <p>{article.content.substring(0, 100)}...</p>
            </div>
        ));
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px', position: 'fixed', bottom: '20px', right: '20px' }}>
            <h3>Chatbot</h3>
            <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        <strong>{msg.sender === 'user' ? 'Vous' : 'Bot'}:</strong> {msg.text}
                    </div>
                ))}
                {step === 1 && renderArticles()}
            </div>
            {step === 0 && (
                <div>
                    <p>Que voulez-vous savoir ?</p>
                    {themes.map((theme) => (
                        <button key={theme._id} onClick={() => handleThemeSelect(theme)}>
                            {theme.name}
                        </button>
                    ))}
                </div>
            )}
            {step === 1 && (
                <button onClick={handleBack} style={{ marginTop: '10px' }}>
                    Retour
                </button>
            )}
        </div>
    );
};

export default Chatbot;
