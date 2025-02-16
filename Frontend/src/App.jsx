import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from './pages/Dashboard';
import BeneficiaryForm from "./pages/BeneficiaryForm"
import WillForm from './pages/WillForm';
import WillPage from "./pages/WillPage";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/beneficiaries" element={<WillForm />} />
        <Route exact path="/will" element={<WillPage />} />
        <Route path="/beneficiaries_form" element={<BeneficiaryForm />} />
      </Routes>
    </>
  );
}

export default App;
