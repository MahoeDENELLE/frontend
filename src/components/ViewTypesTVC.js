import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewTypesTVC = () => {
    const navigate = useNavigate(); 
    const [types, setTypes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    const handleBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await fetch('http://192.168.1.47:5000/types-tvc');
            const data = await response.json();
            if (data.success) setTypes(data.types);
        } catch (error) {
            console.error('Erreur lors de la récupération des types de TVC', error);
        }
    };

    const updatePrice = async (id) => {
        if (isNaN(newPrice) || newPrice === '') {
            alert('Veuillez entrer un prix valide.');
            return;
        }

        try {
            const response = await fetch(`http://192.168.1.47:5000/update-type-tvc/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: parseFloat(newPrice) })
            });

            const data = await response.json();
            if (data.success) {
                fetchTypes();
                setEditingId(null);
                setNewPrice('');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du prix', error);
        }
    };

    const deleteType = async (id) => {
        try {
            const response = await fetch(`http://192.168.1.47:5000/delete-type-tvc/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) fetchTypes();
        } catch (error) {
            console.error('Erreur lors de la suppression du type de TVC', error);
        }
    };

    return (
        <div className="view-types-tvc-container">
            <button className="back-button" onClick={handleBack}>←</button>
            <h2>Liste des types de TVC</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {types.map((type) => (
                        <tr key={type.id}>
                            <td>{type.name}</td>
                            <td>
                                {editingId === type.id ? (
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                    />
                                ) : (
                                    <>
                                        {type.price} €
                                    </>
                                )}
                            </td>
                            <td>
                                {editingId === type.id ? (
                                    <button onClick={() => updatePrice(type.id)}>Enregistrer</button>
                                ) : (
                                    <button onClick={() => setEditingId(type.id)}>Modifier</button>
                                )}
                                <button onClick={() => deleteType(type.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTypesTVC;
