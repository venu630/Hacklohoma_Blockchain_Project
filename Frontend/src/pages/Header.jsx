import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ children }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        <div className="brand-content">
          <span className="brand-icon">⛓️</span>
          <div className="brand-text">
            <span className="brand-name">CryptoWill</span>
            <span className="brand-tagline">Smart Contract Inheritance</span>
          </div>
        </div>
      </div>
      {children}
    </nav>
  );
};

export default Header;
