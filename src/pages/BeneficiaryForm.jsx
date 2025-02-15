import React from "react";

function BeneficiaryForm({ index }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
      <p><strong>Beneficiary #{index + 1} Details</strong></p>
      <div style={{ marginBottom: "0.5rem" }}>
        <label htmlFor={`name-${index}`} style={{ marginRight: "0.5rem" }}>
          Name:
        </label>
        <input type="text" id={`name-${index}`} name={`name-${index}`} />
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <label htmlFor={`age-${index}`} style={{ marginRight: "0.5rem" }}>
          Age:
        </label>
        <input type="number" id={`age-${index}`} name={`age-${index}`} />
      </div>
      {/* Add more fields as needed */}
    </div>
  );
}

export default BeneficiaryForm;
