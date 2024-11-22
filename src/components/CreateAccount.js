import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateAccount = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('administration');
  const [message, setMessage] = useState('');

  const handleBack = () => {
    navigate(-1); 
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://192.168.1.47:5000/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, nom, prenom, password, role })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Compte créé avec succès !');
        setUsername('');
        setNom('');
        setPrenom('');
        setPassword('');
        setRole('administration');
      } else {
        setMessage('Erreur lors de la création du compte.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte', error);
      setMessage('Erreur du serveur.');
    }
  };

  return (
    <div className="create-account-container">
      <button className="back-button" onClick={handleBack}>←</button>
      <h2>Créer un compte</h2>
      <form onSubmit={handleCreateAccount}>
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
          <input 
          type="text" 
          placeholder="Nom" 
          value={nom} 
          onChange={(e) => setNom(e.target.value)} 
          required 
        />
          <input 
          type="text" 
          placeholder="Prénom" 
          value={prenom} 
          onChange={(e) => setPrenom(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="administration">Administration</option>
          <option value="technicien">Technicien</option>
        </select>
        <button type="submit">Créer le compte</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAccount;
