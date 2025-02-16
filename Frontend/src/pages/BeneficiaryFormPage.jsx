import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import BeneficiaryForm from "./BeneficiaryForm";

function BeneficiaryFormPage() {
  const navigate = useNavigate();
  const { search } = useLocation(); // e.g. "?count=5"
  const { formIndex } = useParams(); // the :formIndex from the URL
  
  // Parse the query param 'count'
  const queryParams = new URLSearchParams(search);
  const totalCount = parseInt(queryParams.get("count"), 10) || 0;
  
  // Convert formIndex from string to number
  const currentIndex = parseInt(formIndex, 10);
  
  if (!totalCount || !currentIndex) {
    return <p>Invalid page or missing query parameter.</p>;
  }
  
  // State for the current form's data and its validity
  const [currentFormData, setCurrentFormData] = useState({});
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
  
  // Callback to receive form state from BeneficiaryForm
  const handleFormDataChange = (values, valid) => {
    setCurrentFormData(values);
    setIsCurrentFormValid(valid);
  };
  
  // Save current form data in sessionStorage for aggregation
  const saveCurrentData = () => {
    const existingData = JSON.parse(sessionStorage.getItem("beneficiaries") || "{}");
    existingData[currentIndex] = currentFormData;
    sessionStorage.setItem("beneficiaries", JSON.stringify(existingData));
  };
  
  // Handler for Next/Submit button
  const handleNextOrSubmit = () => {
    if (!isCurrentFormValid) {
      alert("Please fill all fields correctly before proceeding.");
      return;
    }
  
    // Save the current beneficiary's data
    saveCurrentData();
  
    if (currentIndex < totalCount) {
      // Navigate to the next beneficiary form (it will mount fresh because of key)
      navigate(`/beneficiaries/${currentIndex + 1}?count=${totalCount}`);
    } else {
      // Retrieve WillForm data
      const willFormData = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
      const beneficiariesData = JSON.parse(sessionStorage.getItem("beneficiaries") || "{}");

      // Combine WillForm details with beneficiaries' data
      const allData = {
        willForm: willFormData,
        beneficiaries: beneficiariesData
      };

      // Validate total percentage share
      const totalShare = Object.values(beneficiariesData).reduce(
        (acc, data) => acc + Number(data.percentageShare || 0),
        0
      );

      if (totalShare !== 100) {
        alert(`The total percentage share must equal 100. Currently, it is ${totalShare}.`);
        return;
      }

      // Optionally clear sessionStorage after submission
      sessionStorage.removeItem("beneficiaries");
      sessionStorage.removeItem("userDetails");

      // Simulate API submission (replace with actual API call)
      console.log("Submitting all data to API:", allData);
      alert("All data submitted successfully!");

      navigate("/"); // Redirect to a summary page or home
    }
  };
  
  // Handler for the Previous button
  const handlePrevious = () => {
    if (currentIndex > 1) {
      navigate(`/beneficiaries/${currentIndex - 1}?count=${totalCount}`);
    } else {
      navigate("/");
    }
  };
  
  return (
    <div
      style={{
        width: "50%", // Ensures form remains 50% width
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers horizontally
        justifyContent: "center", // Centers vertically
        margin: "0 auto", // Prevents horizontal overflow
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>
        Beneficiary {currentIndex} of {totalCount}
      </h3>
  
      {/* Render BeneficiaryForm with a unique key so that it mounts blank */}
      <BeneficiaryForm
        key={currentIndex}
        index={currentIndex - 1}
        onFormDataChange={handleFormDataChange}
      />
  
      {/* Navigation buttons with standard PrimeReact styling */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Button
          label="Previous"
          icon="pi pi-angle-left"
          onClick={handlePrevious}
          disabled={currentIndex <= 1}
          className="p-button-outlined"
        />
        <Button
          label={currentIndex < totalCount ? "Next" : "Submit"}
          icon={currentIndex < totalCount ? "pi pi-angle-right" : "pi pi-check"}
          onClick={handleNextOrSubmit}
          disabled={!isCurrentFormValid}
          className="p-button-primary"
        />
      </div>
    </div>
  );
}

export default BeneficiaryFormPage;
