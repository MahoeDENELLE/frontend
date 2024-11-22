import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const DossierDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dossier, setDossier] = useState(null);
    const [types, setTypes] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleBack = () => {
        navigate(-1); 
    };

    const fetchDossier = useCallback(async () => {
        try {
            const response = await fetch(`http://192.168.1.47:5000/tvc-dossier/${id}`);
            const data = await response.json();
            if (data.success) {
                setDossier(data.dossier);
                setTypes(data.types);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du dossier TVC', error);
        }
    }, [id]);

    const fetchAllTypes = useCallback(async () => {
        try {
            const response = await fetch('http://192.168.1.47:5000/types-tvc');
            const data = await response.json();
            if (data.success) {
                setAllTypes(data.types);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des types de TVC', error);
        }
    }, []);

    useEffect(() => {
        fetchDossier();
        fetchAllTypes();
    }, [fetchDossier, fetchAllTypes]);


    const handleEditToggle = () => {
        setIsEditing(!isEditing);

        if (!isEditing && dossier.appointmentDate) {
            const localDate = new Date(dossier.appointmentDate);
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
            
            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            setDossier(prevDossier => ({ ...prevDossier, appointmentDate: formattedDate }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDossier((prevDossier) => ({ ...prevDossier, [name]: value }));
    };

    const handleTypeChange = (index, value) => {
        setTypes((prevTypes) =>
            prevTypes.map((type, i) =>
                i === index ? { ...type, quantity: value } : type
            )
        );
    };

    const handleTypeAddition = () => {
        setTypes([...types, { typeId: '', quantity: 1 }]);
    };

    const handleTypeSelection = (index, typeId) => {
        setTypes((prevTypes) =>
            prevTypes.map((type, i) =>
                i === index ? { ...type, typeId: typeId } : type
            )
        );
    };

    const handleDeleteType = (index) => {
        setTypes(types.filter((_, i) => i !== index));
    };

    const handleSaveChanges = async () => {
        const invalidType = types.find((type) => !type.typeId);
        if (invalidType) {
            alert("Veuillez sélectionner un type valide pour tous les éléments.");
            return;
        }
    
        if (dossier.appointmentDate === "") {
            dossier.appointmentDate = null;
        }
    
        try {
            const response = await fetch(`http://192.168.1.47:5000/tvc-dossier/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...dossier, types }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur: ${response.status} - ${errorText}`);
            }
    
            const data = await response.json();
            if (data.success) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du dossier TVC', error);
            setIsEditing(false);
        }
    };
    
    

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDeleteDossier = async () => {
        try {
            const response = await fetch(`http://192.168.1.47:5000/tvc-dossier/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                navigate(-1); 
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du dossier', error);
            alert('Une erreur est survenue lors de la suppression du dossier.');
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text(`Dossier TVC`, 20, 20);
        doc.text(`Nom : ${dossier.firstName} ${dossier.lastName}`, 20, 30);
        doc.text(`Adresse : ${dossier.address}`, 20, 40);
        doc.text(`Code Postal : ${dossier.postalCode}`, 20, 50);
        doc.text(`Ville : ${dossier.city}`, 20, 60);
        doc.text(`Téléphone : ${dossier.phone}`, 20, 70);
        doc.text(`Types de TVC :`, 20, 110);
        types.forEach((type, index) => {
            const typeName = allTypes.find(t => t.id === type.typeId)?.name || 'N/A';
            doc.text(`Type : ${typeName}, Quantité : ${type.quantity}`, 20, 120 + index * 10);
        });
        doc.save(`devis_tvc_${dossier.firstName}_${dossier.lastName}.pdf`);
    };
    

    if (!dossier) return <div>Chargement...</div>;

    return (
        <div className="dossier-details-container">
            <button className="back-button" onClick={handleBack}>←</button>
            <h2>Détails du dossier TVC</h2>
            <div className="dossier-detail">
                <strong>Nom : </strong>
                {isEditing ? (
                    <input type="text" name="firstName" value={dossier.firstName} onChange={handleInputChange} />
                ) : (
                    dossier.firstName
                )}
            </div>
            <div className="dossier-detail">
                <strong>Prénom : </strong>
                {isEditing ? (
                    <input type="text" name="lastName" value={dossier.lastName} onChange={handleInputChange} />
                ) : (
                    dossier.lastName
                )}
            </div>
            <div className="dossier-detail">
                <strong>Adresse : </strong>
                {isEditing ? (
                    <input type="text" name="address" value={dossier.address} onChange={handleInputChange} />
                ) : (
                    dossier.address
                )}
            </div>
            <div className="dossier-detail">
                <strong>Code postal : </strong>
                {isEditing ? (
                    <input type="tel" name="postalCode" value={dossier.postalCode} onChange={handleInputChange} />
                ) : (
                    dossier.postalCode
                )}
            </div>
            <div className="dossier-detail">
                <strong>Ville : </strong>
                {isEditing ? (
                    <input type="text" name="city" value={dossier.city} onChange={handleInputChange} />
                ) : (
                    dossier.city
                )}
            </div>
            <div className="dossier-detail">
                <strong>Téléphone : </strong>
                {isEditing ? (
                    <input type="text" name="phone" value={dossier.phone} onChange={handleInputChange} />
                ) : (
                    dossier.phone
                )}
            </div>
            <div className="dossier-detail">
    <strong>Date de rendez-vous : </strong>
    {isEditing ? (
        <input 
            type="datetime-local" 
            name="appointmentDate" 
            value={dossier.appointmentDate || ""} 
            onChange={handleInputChange} 
        />
    ) : (
        dossier.appointmentDate ? new Date(dossier.appointmentDate).toLocaleString() : "Pas de date de rendez-vous"
    )}
</div>


            <div className="dossier-detail">
                <strong>Commentaire : </strong>
                {isEditing ? (
                    <textarea
                        name="commentaire"
                        value={dossier.commentaire || ''}
                        onChange={handleInputChange}
                        rows="4"
                        cols="40"
                    />
                ) : (
                    dossier.commentaire || 'Aucun commentaire'
                )}
            </div>

            <h3>Types de TVC</h3>
            <ul className="tvc-types">
                {types.map((type, index) => (
                    <li key={index}>
                        {isEditing ? (
                            <>
                                <select
                                    value={type.typeId}
                                    onChange={(e) => handleTypeSelection(index, e.target.value)}
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {allTypes.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    min="1"
                                    value={type.quantity}
                                    onChange={(e) => handleTypeChange(index, e.target.value)}
                                />
                                <button onClick={() => handleDeleteType(index)}>Supprimer</button>
                            </>
                        ) : (
                            <>
                                <span>Type : {allTypes.find(t => t.id === type.typeId)?.name || 'N/A'}</span> - Quantité : {type.quantity}
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {isEditing && <button onClick={handleTypeAddition}>Ajouter un type</button>}
            <div className="button-container">
                {isEditing ? (
                    <>
                        <button onClick={handleSaveChanges}>Enregistrer</button>
                        <button onClick={handleCancelEdit}>Annuler</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleEditToggle}>Modifier</button>
                        <button onClick={handleDownload}>Télécharger le devis</button>
                        <button 
                            onClick={() => setShowConfirmDelete(true)} 
                            style={{ color: 'red' }}
                        >
                            Supprimer le dossier
                        </button>
                    </>
                )}
            </div>

            {showConfirmDelete && (
                <div className="confirm-dialog">
                    <div className="dialog-content">
                        <p>Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible.</p>
                        <div className="dialog-buttons">
                            <button 
                                onClick={handleDeleteDossier} 
                                style={{ backgroundColor: 'red', color: 'white' }}
                            >
                                Confirmer
                            </button>
                            <button onClick={() => setShowConfirmDelete(false)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DossierDetails;
