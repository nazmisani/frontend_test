import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import MovieDetail from "./pages/MovieDetail";
import WatchList from "./pages/WatchList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/watch_list" element={<WatchList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
