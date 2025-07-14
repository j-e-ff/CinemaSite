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
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <div>
            <Link to="/lists" className="nav-link">
              Lists
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Log out
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-btn">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
