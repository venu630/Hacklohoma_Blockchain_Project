import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const BeneficiaryCount = () => {
  const [selectedCount, setSelectedCount] = useState(null);

  // Dropdown items (numbers)
  const countItems = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 }
  ];

  const handleSubmit = () => {
    // Handle submit logic (e.g., send selectedCount to an API, etc.)
    console.log('Selected count is:', selectedCount);
  };

  return (
    <div className="card">
      <h3>Select Count of Beneficiaries</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown
          value={selectedCount}
          options={countItems}
          onChange={(e) => setSelectedCount(e.value)}
          placeholder="No.of beneficiaries"
          style={{ width: '200px', marginRight: '1rem' }} // keeps dropdown the same width
        />
        <Button
          type="button"
          label="Submit"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BeneficiaryCount;
