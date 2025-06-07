import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { MovieProvider, useMovieContext } from "./context/MovieContext";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Favorite from "./pages/Favorite";
import MovieDetail from "./pages/MovieDetail";
import WatchList from "./pages/WatchList";
import BaseLayout from "./pages/BaseLayout";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useMovieContext();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <LoadingSpinner />
        <p className="text-gray-400 mt-4">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<BaseLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:movie_id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchList />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <MovieProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MovieProvider>
  );
}

export default App;
