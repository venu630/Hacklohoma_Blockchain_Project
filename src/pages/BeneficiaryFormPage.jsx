import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BeneficiaryForm from "./BeneficiaryForm";

function BeneficiaryFormPage() {
  const navigate = useNavigate();
  const { search } = useLocation(); // gives us something like "?count=5"
  const { formIndex } = useParams(); // the :formIndex from the URL
  
  // Parse the query param 'count'
  const queryParams = new URLSearchParams(search);
  const totalCount = parseInt(queryParams.get("count"), 10) || 0;
  
  // Convert formIndex from string to number
  const currentIndex = parseInt(formIndex, 10);

  if (!totalCount || !currentIndex) {
    return <p>Invalid page or missing query parameter.</p>;
  }

  // Handler for next form
  const handleNext = () => {
    if (currentIndex < totalCount) {
      // Go to the next form
      navigate(`/beneficiaries/${currentIndex + 1}?count=${totalCount}`);
    } else {
      // If it's the last form, do final submission or navigate to a summary page
      alert("All forms completed!");
      // e.g., navigate("/summary");
    }
  };

  // Handler for previous form
  const handlePrevious = () => {
    if (currentIndex > 1) {
      // Go to the previous form
      navigate(`/beneficiaries/${currentIndex - 1}?count=${totalCount}`);
    } else {
      // If we're on the first form, maybe go back to the homepage
      navigate("/");
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h3>
        Beneficiary {currentIndex} of {totalCount}
      </h3>

      {/* Reusable beneficiary form component */}
      <BeneficiaryForm index={currentIndex - 1} />

      {/* Navigation buttons */}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handlePrevious} disabled={currentIndex <= 1}>
          Previous
        </button>
        <button onClick={handleNext} style={{ marginLeft: "0.5rem" }}>
          {currentIndex < totalCount ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}

export default BeneficiaryFormPage;
