import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TVDetails from "./pages/TVDetails";
import NavBar from "./components/NavBar";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";


function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites/>} />
          <Route path="/movie/:id" element={<MovieDetails/>} />
          <Route path="/tv/:id" element={<TVDetails/>} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
