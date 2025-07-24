import "./css/App.css";
import Lists from "./pages/Lists";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import { AuthProvider } from "./context/AuthContext";
import ActorsPage from "./pages/ActorsPage";
import ReviewsPage from "./pages/ReviewsPage";
import ItemDetails from "./components/ItemDetails";

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/:type/:id" element={<ItemDetails />} />
            {/* <Route path="/:type/:id" element={<ItemDetails />} /> */}
            <Route path="/actor/:id" element={<ActorsPage />} />
            <Route path="/reviews/:item_type/:item_id" element={<ReviewsPage/>}/>
          </Routes>
        </main>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
