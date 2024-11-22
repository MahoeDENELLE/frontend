import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa'; 

const ViewDossiers = () => {
    const [dossiers, setDossiers] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); 
      };
    

    useEffect(() => {
        const fetchDossiers = async () => {
            try {
                const response = await fetch('http://194.164.202.129:5000/tvc-dossiers');
                const data = await response.json();
                if (data.success) {
                    setDossiers(data.dossiers);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des dossiers TVC', error);
            }
        };

        fetchDossiers();
    }, []);

    const handleViewDossier = (id) => {
        navigate(`/dossier/${id}`);
    };

    return (
        <div className="view-dossiers-container">
            <button className="back-button" onClick={handleBack}>←</button>
            <h2>Liste des dossiers TVC</h2>
            
            <ul>
                {dossiers.map((dossier) => (
                    <li key={dossier.id} onClick={() => handleViewDossier(dossier.id)}>
                        <FaFileAlt className="icon" />
                        <div className="dossier-info">
                            <span className="dossier-name">{dossier.firstName} {dossier.lastName}</span>
                            <span className="dossier-address">{dossier.address} {dossier.postalCode}, {dossier.city}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewDossiers;
