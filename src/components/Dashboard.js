import React, { useEffect, useState } from 'react';
import './styles.css'; 


const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bonjour, {username} !</h1>
        <p>Que voulez-vous faire ?</p>
      </div>
      
      <nav className="dashboard-nav">
        <ul>

        {role === 'technicien' && (
            <>
          <li><a href="/mes-interventions">Mes interventions</a></li>
          <li><a href="/create-tvc">Créer un dossiers TVC</a></li>
          <li><a href="/">Se déconnecter</a></li>
            </>
          )}

          
          {role === 'administration' && (
            <>
            <li><a href="/create-tvc">Créer un dossiers TVC</a></li>
            <li><a href="/view-dossiers">Gérer les dossiers TVC</a></li>
              <li><a href="/create-account">Créer un compte</a></li>
              <li><a href="/create-type-tvc">Créer un type de TVC</a></li>
              <li><a href="/view-types-tvc">Gérer les types de TVC</a></li>
              <li><a href="/">Se déconnecter</a></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
