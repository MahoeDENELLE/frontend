import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTVC = () => {
    const navigate = useNavigate(); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState(''); 
    const [city, setCity] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [commentaire, setCommentaire] = useState('');

    const handleBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await fetch('http://194.164.202.129:5000/types-tvc');
            const data = await response.json();
            if (data.success) setTypes(data.types);
        } catch (error) {
            console.error('Erreur lors de la récupération des types de TVC', error);
        }
    };

    const addType = () => {
        if (selectedTypeId) {
            const type = types.find((type) => type.id === parseInt(selectedTypeId));
            if (type) {
                setSelectedTypes([...selectedTypes, { ...type, quantity }]);
                setQuantity(1); 
            }
        }
    };

    const removeType = (typeId) => {
        setSelectedTypes(selectedTypes.filter(type => type.id !== typeId));
    };

    const updateQuantity = (index, newQuantity) => {
        const quantity = parseInt(newQuantity, 10); 
        if (!isNaN(quantity) && quantity > 0) { 
            const updatedTypes = [...selectedTypes];
            updatedTypes[index].quantity = quantity;
            setSelectedTypes(updatedTypes);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Supprimer appointmentDate de la validation
        const isFormValid = firstName && lastName && phone && address && selectedTypes.length > 0;
    
        if (!isFormValid) {
            alert('Veuillez remplir tous les champs requis.');
            return;
        }
    
        const tvcTypes = selectedTypes.map(({ id, quantity }) => ({ id, quantity }));
    
        const dossierData = { firstName, lastName, phone, address, postalCode, city, appointmentDate, tvcTypes, commentaire };
    
        try {
            const response = await fetch('http://194.164.202.129:5000/create-tvc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dossierData),
            });
    
            const data = await response.json();
            if (data.success) {
                
                setFirstName('');
                setLastName('');
                setPhone('');
                setAddress('');
                setPostalCode(''); 
                setCity('');
                setAppointmentDate(''); 
                setSelectedTypes([]);
                setCommentaire('');
                alert('Dossier TVC créé avec succès');
                navigate(-1);
            } else {
                alert(data.message || 'Erreur lors de la création du dossier TVC');
            }
        } catch (error) {
            console.error('Erreur lors de la création du dossier TVC', error);
            alert('Erreur lors de la création du dossier TVC');
        }
    };
    

    return (
        <div className="create-tvc-container">
            <button className="back-button" onClick={handleBack}>←</button>
            <h2>Créer un dossier TVC</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Prénom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="tel" placeholder="Numéro" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input type="text" placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="tel" placeholder="Code Postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required />
                <h6>Date du rendez-vous</h6>
                <input type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}  />
                <textarea placeholder="Commentaire" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="5" cols="50" />

                <div className="tvc-types-selector">
                    <h2>Ajoute les types TVC</h2>
                    <select
                        value={selectedTypeId}
                        onChange={(e) => setSelectedTypeId(e.target.value)}
                    >
                        <option value="">Sélectionner un type de TVC</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name} - {type.price} €
                            </option>
                        ))}
                    </select>

                    <input
                        type="tel"
                        value={quantity}
                        min="0"
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="quantity-input" 
                    />

                    <button type="button" onClick={addType} className="add-type-button">Ajouter</button>
                </div>

                <ul className="selected-types-list">
                    {selectedTypes.map((type, index) => (
                        <li key={type.id} className="selected-type-item">
                            {type.name} - {type.price} € x 
                            <input
                                type="tel"
                                value={type.quantity}
                                min="0"
                                onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                className="quantity-input"
                            />
                            <button type="button" onClick={() => removeType(type.id)}>Supprimer</button>
                        </li>
                    ))}
                </ul>

                <button type="submit">Créer le dossier TVC</button>
            </form>
        </div>
    );
};

export default CreateTVC;
