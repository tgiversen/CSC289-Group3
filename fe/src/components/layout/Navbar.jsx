import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../stores/authSlice";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => Boolean(state.auth?.user));
  const handleSignOut = async () => {
    try {
      await dispatch(logout());
      navigate("/");
      setTimeout(() => window.location.reload(), 100);
    } catch {
      console.error("Logout failed");
    }
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
              <button className="signout-btn" onClick={handleSignOut}>
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
