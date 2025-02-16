import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BeneficiaryCount from "./pages/BeneficiaryCount";
import BeneficiaryFormpage from "./pages/BeneficiaryFormPage";
import WillPage from "./pages/WillPage";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/beneficiaries" element={<BeneficiaryCount />} />
        <Route
          path="/beneficiaries/:formIndex"
          element={<BeneficiaryFormpage />}
        />
        <Route exact path="/will" element={<WillPage />} />
      </Routes>
    </>
  );
}

export default App;
