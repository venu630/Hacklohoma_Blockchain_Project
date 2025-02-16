
import React, { useEffect } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import BeneficiaryFormpage from "./pages/BeneficiaryFormPage"
import WillForm from './pages/WillForm';
import WillPage from "./pages/WillPage";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/beneficiaries" element={<WillForm />} />
        <Route exact path="/will" element={<WillPage />} />
        <Route path="/beneficiaries/:formIndex" element={<BeneficiaryFormpage />} />
      </Routes>
    </>
  );
}

export default App;
