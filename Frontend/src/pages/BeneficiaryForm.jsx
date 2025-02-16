import React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import '../styles/FormDemo.css';

function BeneficiaryForm({ index, onFormDataChange, initialData }) {
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
    // Email Address (New Field)
    if (!data.email) {
      errors.email = 'Email is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = 'Invalid email format.';
    }
    // Age
    if (!data.age) {
      errors.age = 'Age is required.';
    } else if (isNaN(Number(data.age)) || Number(data.age) <= 0) {
      errors.age = 'Please enter a valid age.';
    }
    // Relation
    if (!data.relation) {
      errors.relation = 'Relation is required.';
    }
    // Wallet Address
    if (!data.walletAddress) {
      errors.walletAddress = 'Wallet Address is required.';
    }
    // Percentage Share
    if (
      data.percentageShare === undefined ||
      data.percentageShare === '' ||
      isNaN(Number(data.percentageShare))
    ) {
      errors.percentageShare = 'Percentage Share is required and must be a number.';
    } else {
      const share = Number(data.percentageShare);
      if (share < 1 || share > 100) {
        errors.percentageShare = 'Percentage Share must be between 1 and 100.';
      }
    }
    // Sale Deed (PDF upload)
    if (!data.saleDeed || !data.saleDeed.name) {
      errors.saleDeed = 'Sale Deed (PDF) is required.';
    } else {
      const fileName = data.saleDeed.name.toLowerCase();
      if (!fileName.endsWith('.pdf')) {
        errors.saleDeed = 'Sale Deed must be a PDF file.';
      }
    }

    return errors;
  };

  // Helper functions for error display
  const isFormFieldValid = (meta) => meta.touched && meta.error;
  const getFormErrorMessage = (meta) =>
    isFormFieldValid(meta) ? <small className="p-error">{meta.error}</small> : null;

  return (
    <div style={{ border: '1px solid #ccc', padding: '2rem', margin: '1rem 0' }}>
      <h3>Beneficiary #{index + 1} Details</h3>
      <Form
        onSubmit={() => {}} // No local submit action needed.
        initialValues={{
          // Note: We intentionally do not pass previous data when a new form is rendered.
          firstName: initialData?.firstName || '',
          lastName: initialData?.lastName || '',
          email: initialData?.email || '', // New field
          age: initialData?.age || '',
          relation: initialData?.relation || '',
          walletAddress: initialData?.walletAddress || '',
          percentageShare: initialData?.percentageShare || '',
          saleDeed: initialData?.saleDeed || null,
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
                      id={`firstName-${index}`}
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`firstName-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
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
                      id={`lastName-${index}`}
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`lastName-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Last Name*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Email Address (New Field) */}
            <Field name="email">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id={`email-${index}`}
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`email-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Email Address*
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
                      id={`age-${index}`}
                      {...input}
                      keyfilter="int"
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`age-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Age*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Relation */}
            <Field name="relation">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id={`relation-${index}`}
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`relation-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Relation*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Wallet Address */}
            <Field name="walletAddress">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id={`walletAddress-${index}`}
                      {...input}
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`walletAddress-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Wallet Address*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Percentage Share */}
            <Field name="percentageShare">
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id={`percentageShare-${index}`}
                      {...input}
                      keyfilter="int"
                      className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                    />
                    <label
                      htmlFor={`percentageShare-${index}`}
                      className={classNames({ 'p-error': isFormFieldValid(meta) })}
                    >
                      Percentage Share*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* Sale Deed (PDF Upload) */}
            <Field name="saleDeed">
              {({ input, meta }) => (
                <div className="field">
                  <label
                    htmlFor={`saleDeed-${index}`}
                    className={classNames({ 'p-error': isFormFieldValid(meta) })}
                  >
                    Sale Deed (PDF Upload)*
                  </label>
                  <input
                    id={`saleDeed-${index}`}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      input.onChange(e.target.files && e.target.files[0]);
                    }}
                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                  />
                  {getFormErrorMessage(meta)}
                </div>
              )}
            </Field>

            {/* FormSpy to report form values and validity */}
            <FormSpy subscription={{ values: true, valid: true }}>
              {({ values, valid }) => {
                if (onFormDataChange) {
                  onFormDataChange(values, valid);
                }
                return null;
              }}
            </FormSpy>
          </form>
        )}
      />
    </div>
  );
}

export default BeneficiaryForm;
