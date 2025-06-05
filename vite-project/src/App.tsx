import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorite from "./pages/Favorite";
import MovieDetail from "./pages/MovieDetail";
import WatchList from "./pages/WatchList";
import BaseLayout from "./pages/BaseLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
