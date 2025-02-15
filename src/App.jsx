import React, { useEffect } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import BeneficiaryCount from "./pages/BeneficiaryCount"

function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/beneficiary_count" element={<BeneficiaryCount />} />
      </Routes>
    </>
  );
}

export default App;
