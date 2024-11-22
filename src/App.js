import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateAccount from './components/CreateAccount';
import CreateTypeTVC from './components/CreateTypeTVC';
import ViewTypesTVC from './components/ViewTypesTVC';
import CreateTVC from './components/CreateTVC';
import ViewDossiers from './components/ViewDossiers';
import DossierDetails from './components/DossierDetails';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-type-tvc" element={<CreateTypeTVC />} />
        <Route path="/view-types-tvc" element={<ViewTypesTVC />} />
        <Route path="/create-tvc" element={<CreateTVC />} />
        <Route path="/view-dossiers" element={<ViewDossiers />} />
        <Route path="/dossier/:id" element={<DossierDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
