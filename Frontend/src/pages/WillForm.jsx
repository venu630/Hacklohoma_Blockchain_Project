import React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useNavigate } from "react-router-dom";
import '../styles/FormDemo.css';

function WillForm() {
  const navigate = useNavigate();

  // Validation function for the form fields
  const validate = (data) => {
    const errors = {};

    // First Name
    if (!data.firstName) {
      errors.firstName = 'First Name is required.';
    }
    // Last Name
    if (!data.lastName) {
      errors.lastName = 'Last Name is required.';
    }
    // Age
    if (!data.age) {
      errors.age = 'Age is required.';
    } else if (isNaN(Number(data.age)) || Number(data.age) <= 0) {
      errors.age = 'Please enter a valid age.';
    }
    // Beneficiary Count
    if (!data.beneficiaryCount) {
      errors.beneficiaryCount = 'Beneficiary Count is required.';
    }

    return errors;
  };

  // Helper functions for error display
  const isFormFieldValid = (meta) => meta.touched && meta.error;
  const getFormErrorMessage = (meta) =>
    isFormFieldValid(meta) ? <small className="p-error">{meta.error}</small> : null;

  const handleNavigation = (values, valid) => {
    if (!valid) {
      alert("Please fill all fields correctly before proceeding.");
      return;
    }

    // Store user details in sessionStorage
    sessionStorage.setItem("userDetails", JSON.stringify(values));

    // Navigate to the first beneficiary form
    navigate(`/beneficiaries/1?count=${values.beneficiaryCount}`);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '1rem 0', width: "50%", marginLeft: "auto", marginRight: "auto" }}>
      <h3>Your Details</h3>
      <Form
        onSubmit={() => {}} // No local submit action needed.
        initialValues={{
          firstName: '',
          lastName: '',
          age: '',
          beneficiaryCount: null,
        }}
        validate={validate}
        render={({ handleSubmit }) => (
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

            {/* Age */}
            <Field name="age">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="age"
                      {...input}
                      keyfilter="int"
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label htmlFor="age" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                      Age*
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
                      options={[
                        { label: "1", value: 1 },
                        { label: "2", value: 2 },
                        { label: "3", value: 3 },
                        { label: "4", value: 4 },
                        { label: "5", value: 5 },
                      ]}
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

            {/* Navigation Buttons */}
            <FormSpy subscription={{ values: true, valid: true }}>
              {({ values, valid }) => (
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                  <Button
                    label="Previous"
                    icon="pi pi-angle-left"
                    onClick={() => navigate("/")}
                    className="p-button-outlined"
                  />
                  <Button
                    label="Next"
                    icon="pi pi-angle-right"
                    onClick={() => handleNavigation(values, valid)}
                    disabled={!valid}
                    className="p-button-primary"
                  />
                </div>
              )}
            </FormSpy>
          </form>
        )}
      />
    </div>
  );
}

export default WillForm;
