import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://194.164.202.129:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role); 
        navigate('/dashboard');
      } else {
        setErrorMessage('Erreur de connexion. Veuillez vérifier vos identifiants.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setErrorMessage('Erreur de connexion au serveur.');
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion</h2>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
