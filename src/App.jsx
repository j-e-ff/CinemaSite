import "./css/App.css";
import Lists from "./pages/Lists"
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TVDetails from "./pages/TVDetails";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import ActorsPage from "./pages/ActorsPage";


function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lists" element={<Lists/>} />
          <Route path="/movie/:id" element={<MovieDetails/>} />
          <Route path="/tv/:id" element={<TVDetails/>} />
          <Route path="/actor/:id" element={<ActorsPage/>}/>
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
