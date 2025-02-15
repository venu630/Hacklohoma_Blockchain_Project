import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">CryptoWill</div>
        <div className="nav-buttons">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-outline"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="btn btn-primary"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Secure Your Legacy with Blockchain</h1>
        <p>
          Create and manage smart contract-based wills for your digital assets
        </p>
        <button onClick={() => navigate("/signup")} className="btn btn-primary">
          Get Started
        </button>
      </header>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <div className="icon">🔐</div>
          <h3>Secure & Transparent</h3>
          <p>
            Blockchain-powered smart contracts ensure your will's security and
            transparency
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">⚡</div>
          <h3>Automatic Execution</h3>
          <p>
            Smart contracts automatically execute your will based on predefined
            conditions
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">💎</div>
          <h3>Digital Assets</h3>
          <p>Support for cryptocurrencies, NFTs, and other digital assets</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Create Account</h4>
            <p>Sign up and verify your identity</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Connect Wallet</h4>
            <p>Link your crypto wallet</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Upload Will</h4>
            <p>Specify beneficiaries and conditions</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Deploy Contract</h4>
            <p>Activate your smart contract will</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="benefits-content">
          <h2>Why Choose CryptoWill?</h2>
          <ul className="benefits-list">
            <li>✓ No intermediaries or lengthy probate process</li>
            <li>✓ Lower costs compared to traditional wills</li>
            <li>✓ Automatic asset distribution to beneficiaries</li>
            <li>✓ Immutable and transparent execution</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Secure Your Digital Legacy?</h2>
        <div className="cta-buttons">
          <button
            onClick={() => navigate("/signup")}
            className="btn btn-primary"
          >
            Create Your Will
          </button>
          <button className="btn btn-outline">Learn More</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
