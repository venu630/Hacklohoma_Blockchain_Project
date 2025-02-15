import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const BeneficiaryCount = () => {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(0);

  const countItems = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ];

  const handleSubmit = () => {
    if (selectedCount > 0) {
      // Navigate to the first beneficiary form
      // We pass the 'count' as a query param, e.g. /beneficiaries/1?count=3
      navigate(`/beneficiaries/1?count=${selectedCount}`);
    } else {
      alert("Please select at least 1 beneficiary.");
    }
  };

  return (
    <div className="card">
      <h3>Select Number of Beneficiaries</h3>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <Dropdown
          value={selectedCount}
          options={countItems}
          onChange={(e) => setSelectedCount(e.value)}
          placeholder="Select a number"
          style={{ width: "200px", marginRight: "1rem" }}
        />
        <Button label="Submit" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default BeneficiaryCount;
