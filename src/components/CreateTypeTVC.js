import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTypeTVC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          const response = await fetch('http://192.168.1.47:5000/create-type-tvc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price})
          });
    
          const data = await response.json();
    
          if (data.success) {
            setMessage(data.message);
            setName('');
            setPrice('');
          } else {
            setMessage('Erreur lors de l\'insertion du type de tvc');
          }
        } catch (error) {
          console.error('Erreur lors de la requête', error);
          setMessage('Erreur du serveur.');
        }
      };

      const handleBack = () => {
        navigate(-1);
      };

      return (
        <div className="create-type-tvc-container">
          <button className="back-button" onClick={handleBack}>←</button>
          <h2>Nouveau type de TVC</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nom du TVC :
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Prix :
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            <button type="submit">Ajouter</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );
    };

export default CreateTypeTVC;