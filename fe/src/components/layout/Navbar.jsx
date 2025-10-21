import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const navigate = useNavigate();
  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate("/"); // ✅ 홈("/")으로 이동
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          SpinStorm
        </Link>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <ul className="menu">
            <li>
              <Link to="/game">Game</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <button className="signout-btn" onClick={() => handleSignOut()}>
                Sign out
              </button>
            </li>
          </ul>
        ) : (
          <ul className="menu">
            <li>
              <Link to="/login" className="signin-btn">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
