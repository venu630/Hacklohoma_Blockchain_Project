import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../data/MultiWillContract.json"; // Import latest ABI

const CONTRACT_ADDRESS = "0x1da9a4c1c3649c93e9c65791b212477e9af3b9df"; // Replace with your deployed contract address

function WillForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function for form fields
  const validate = (data) => {
    const errors = {};

    if (!data.firstName) {
      errors.firstName = "First Name is required.";
    }

    if (!data.lastName) {
      errors.lastName = "Last Name is required.";
    }

    if (!data.ethAmount || parseFloat(data.ethAmount) <= 0) {
      errors.ethAmount = "ETH Amount must be greater than 0.";
    }

    return errors;
  };

  // Helper functions for error display
  const isFormFieldValid = (meta) => meta.touched && meta.error;
  const getFormErrorMessage = (meta) =>
    isFormFieldValid(meta) ? (
      <small className="p-error">{meta.error}</small>
    ) : null;

  // Form submission function
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("✅ Form submitted with values:", values);

    try {
      // Step 1️⃣ Check if MetaMask is installed
      if (!window.ethereum) {
        alert("❌ MetaMask is not detected. Please install MetaMask.");
        setIsSubmitting(false);
        return;
      }

      // Step 2️⃣ Connect to MetaMask
      console.log("🔗 Connecting to MetaMask...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // Step 3️⃣ Convert ETH amount to wei
      const ethValue = ethers.utils.parseEther(values.ethAmount);

      // Debugging log
      console.log("📤 Sending transaction...");
      console.log("First Name:", values.firstName);
      console.log("Last Name:", values.lastName);
      console.log("ETH Locked:", ethValue.toString());

      // Step 4️⃣ Send Transaction
      const transaction = await contract.createWill(
        values.firstName,
        values.lastName,
        { value: ethValue }
      );

      console.log("⏳ Waiting for transaction confirmation...");
      const result = await transaction.wait();
      console.log("✅ Transaction confirmed:", result.transactionHash);
      alert(`✅ Will Created! Tx Hash: ${result.transactionHash}`);

      // Step 5️⃣ Redirect to Beneficiary Form
      navigate("/beneficiaries_form", {
        state: { willOwner: await signer.getAddress() },
      });
    } catch (error) {
      console.error("❌ Error creating will:", error);
      alert("Submission failed! Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "2rem",
        margin: "1rem auto",
        width: "50%",
      }}
    >
      <h3>Create Your Will</h3>
      <Form
        onSubmit={onSubmit}
        initialValues={{ firstName: "", lastName: "", ethAmount: "" }}
        validate={validate}
        render={({ handleSubmit }) => (
          <form
            onSubmit={(e) => {
              console.log("🟢 Form submit event triggered");
              handleSubmit(e);
            }}
            className="p-fluid"
          >
            {/* First Name */}
            <Field name="firstName">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="firstName"
                      {...input}
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="firstName"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      First Name*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Last Name */}
            <Field name="lastName">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="lastName"
                      {...input}
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="lastName"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Last Name*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* ETH Amount */}
            <Field name="ethAmount">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="ethAmount"
                      {...input}
                      keyfilter="num"
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="ethAmount"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      ETH to Lock (e.g., 0.1)*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              label={isSubmitting ? "Processing..." : "Submit"}
              className="p-mt-2"
              disabled={isSubmitting}
            />
          </form>
        )}
      />
    </div>
  );
}

export default WillForm;
