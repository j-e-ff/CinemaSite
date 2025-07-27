import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "../css/NavBar.css";

function NavBar() {
  const { user, logout } = useAuth();

  const handleLogin = () => {
    signInWithPopup(auth, googleProvider).catch(console.error);
  };

  const handleLogout = () => {
    logout().catch(console.error);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <button className="home-button">
          <span>Home</span>
          <span className="tooltip-text">Click for homepage</span>
        </button>
      </Link>
      <div className="navbar-links">
        {user ? (
          <div className="buttons-container">
            <Link to="/lists">
              <button className="lists-button">
                <span>Lists</span>
              </button>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-btn">
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
