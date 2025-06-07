import type { MovieProps } from "../types/index";
import { useNavigate } from "react-router";
import { useMovieContext } from "../context/MovieContext";

export default function MovieCard({ movie }: MovieProps) {
  const {
    isAuthenticated,
    isFavorite: isMovieFavorite,
    isInWatchlist: isMovieInWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
  } = useMovieContext();

  const navigate = useNavigate();

  const isFavorite = isMovieFavorite(movie.id);
  const isWatchlist = isMovieInWatchlist(movie.id);

  async function handleToggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isFavorite) {
      await removeFromFavorites(movie);
    } else {
      await addToFavorites(movie);
    }
  }

  async function handleToggleWatchlist(e: React.MouseEvent) {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isWatchlist) {
      await removeFromWatchlist(movie);
    } else {
      await addToWatchlist(movie);
    }
  }

  function handleNavigate() {
    navigate(`/movie/${movie.id}`);
  }

  return (
    <div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full group"
      onClick={handleNavigate}
    >
      <div className="relative cursor-pointer">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />

        {/* Tombol favorit dan watchlist */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(e);
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          {/* Watchlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWatchlist(e);
            }}
            aria-label={
              isWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
          >
            {isWatchlist ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="p-3">
        <h2 className="text-sm font-semibold truncate text-white">
          {movie.title}
        </h2>
        <p className="text-xs text-gray-400">
          {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </div>
  );
}
