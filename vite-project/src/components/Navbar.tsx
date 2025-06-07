import { Link } from "react-router";
import { useMovieContext } from "../context/MovieContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useMovieContext();

  return (
    <nav className="sticky top-0 z-50 bg-blue-400 text-white py-3">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg tracking-wider">
          CINEMA
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to={"/favorite"} className="hover:underline">
                Favorite
              </Link>
              <Link to={"/watchlist"} className="hover:underline">
                Watchlist
              </Link>{" "}
              <div className="ml-4">
                <button
                  onClick={logout}
                  className="text-white hover:opacity-80 transition-opacity"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link
              to={"/login"}
              className="bg-white text-blue-500 hover:bg-gray-100 text-sm py-1 px-3 rounded transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
