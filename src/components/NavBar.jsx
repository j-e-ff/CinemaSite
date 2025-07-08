import { Link } from "react-router-dom";
import "../css/NavBar.css";
import {useState,useEffect} from "react";

function NavBar() {
  const [searchQuery,setSearchQuery] = useState("");

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/lists" className="nav-link">
          Lists
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
