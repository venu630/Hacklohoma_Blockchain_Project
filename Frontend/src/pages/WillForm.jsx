import React from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function WillForm() {
  const navigate = useNavigate();

  // Validation function for form fields
  const validate = (data) => {
    const errors = {};
    
    if (!data.firstName) {
      errors.firstName = 'First Name is required.';
    }
    
    if (!data.lastName) {
      errors.lastName = 'Last Name is required.';
    }
    
    if (!data.beneficiaryCount) {
      errors.beneficiaryCount = 'Beneficiary Count is required.';
    }

    return errors;
  };

  // Helper functions for error display
  const isFormFieldValid = (meta) => meta.touched && meta.error;
  const getFormErrorMessage = (meta) =>
    isFormFieldValid(meta) ? <small className="p-error">{meta.error}</small> : null;

  // Form submission function
  const onSubmit = async (values) => {
    try {
      // Store beneficiary count in localStorage
      localStorage.setItem("beneficiaryCount", JSON.stringify(values));

      // Submit data to API
      // const response = await axios.post("https://api.example.com/submit-form", values);
      
      // alert("Form submitted successfully!");
      navigate("/beneficiaries_form")
      // console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '1rem auto', width: "50%" }}>
      <h3>Beneficiary Form</h3>
      <Form
        onSubmit={onSubmit}
        initialValues={{ firstName: '', lastName: '', beneficiaryCount: null }}
        validate={validate}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} className="p-fluid">
            {/* First Name */}
            <Field name="firstName">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="firstName"
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
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
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                      Last Name*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Beneficiary Count */}
            <Field name="beneficiaryCount">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <Dropdown
                      id="beneficiaryCount"
                      {...input}
                      options={[1, 2, 3, 4, 5].map((num) => ({ label: String(num), value: num }))}
                      placeholder="Select a number"
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label htmlFor="beneficiaryCount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                      Number of Beneficiaries*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Submit Button */}
            <Button type="submit" label="Submit" className="p-mt-2" />
          </form>
        )}
      />
    </div>
  );
}

export default WillForm;
