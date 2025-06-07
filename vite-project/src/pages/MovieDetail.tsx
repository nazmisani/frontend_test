import { useParams, useNavigate } from "react-router";
import tmdb from "../api/tmdb";
import { useEffect, useState } from "react";
import { useMovieContext } from "../context/MovieContext";

import type { MovieDetailType, Movie } from "../types";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetail() {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { movie_id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [showRatingPanel, setShowRatingPanel] = useState(false);

  const {
    isAuthenticated,
    isFavorite,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    rateMovie,
    deleteRating,
  } = useMovieContext();

  async function fetchMovieDetail() {
    try {
      const response = await tmdb.get(`/movie/${movie_id}`);
      setMovie(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchRecommendations() {
    try {
      const response = await tmdb.get(`movie/${movie_id}/recommendations`);
      setRecommendations(response.data?.results);
      console.log("recom>>>>>>", response.data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function toggleFavorite() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!movie) return;

    const movieToAdd: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      adult: movie.adult,
      original_language: movie.original_language,
      original_title: movie.original_title,
      video: movie.video,
      genre_ids: movie.genres ? movie.genres.map((g) => g.id) : [],
    };

    if (isFavorite(movie.id)) {
      await removeFromFavorites(movieToAdd);
    } else {
      await addToFavorites(movieToAdd);
    }
  }
  async function toggleWatchlist() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!movie) return;

    const movieToAdd: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      adult: movie.adult,
      original_language: movie.original_language,
      original_title: movie.original_title,
      video: movie.video,
      genre_ids: movie.genres ? movie.genres.map((g) => g.id) : [],
    };

    if (isInWatchlist(movie.id)) {
      await removeFromWatchlist(movieToAdd);
    } else {
      await addToWatchlist(movieToAdd);
    }
  }

  async function handleRateMovie(value: number) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!movie) return;

    await rateMovie(movie.id, value);
    setRating(value);
    setShowRatingPanel(false);
  }

  async function handleDeleteRating() {
    if (!isAuthenticated || !movie) return;

    await deleteRating(movie.id);
    setRating(null);
  }
  useEffect(() => {
    setLoading(true);
    fetchMovieDetail();
    fetchRecommendations();
  }, [movie_id]);

  return (
    <div className="min-h-screen bg-black text-white">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="relative">
            <img
              src={
                movie?.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                  : "/fallback-backdrop.jpg"
              }
              alt={movie?.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-10 left-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={
                  movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/fallback-poster.jpg"
                }
                alt={movie?.title}
                className="w-40 rounded shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold">{movie?.title}</h1>
                <p className="mt-2 text-sm text-gray-300">
                  {movie?.release_date && `${movie.release_date}`}
                  {movie?.genres &&
                    Array.isArray(movie.genres) &&
                    movie.genres.length > 0 &&
                    ` • ${movie.genres.map((g) => g.name).join(", ")}`}
                  {movie?.runtime && ` • ${movie.runtime}m`}
                </p>
                {/* Rating and Action Buttons - Similar to the image */}{" "}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-green-400 font-bold">
                      {movie?.vote_average
                        ? `${Math.round(movie.vote_average * 10)}%`
                        : "N/A"}
                    </span>
                  </div>{" "}
                  {/* Favorite Button */}
                  <button
                    onClick={toggleFavorite}
                    className="hover:opacity-80 transition-opacity"
                    aria-label={
                      movie && isFavorite(movie.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {movie && isFavorite(movie.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
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
                        className="h-6 w-6 text-white"
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
                    )}{" "}
                  </button>{" "}
                  {/* Watchlist Button */}
                  <button
                    onClick={toggleWatchlist}
                    className="hover:opacity-80 transition-opacity"
                    aria-label={
                      movie && isInWatchlist(movie.id)
                        ? "Remove from watchlist"
                        : "Add to watchlist"
                    }
                  >
                    {movie && isInWatchlist(movie.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
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
                  </button>{" "}
                  {/* Rating Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRatingPanel(!showRatingPanel)}
                      className="hover:opacity-80 transition-opacity"
                      aria-label="Rate movie"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${
                          rating ? "text-yellow-500" : "text-white"
                        }`}
                        fill={rating ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>

                    {/* Rating Panel */}
                    {showRatingPanel && (
                      <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg p-3 z-10 w-64">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">
                              Rate this movie
                            </h4>
                            <button
                              onClick={() => setShowRatingPanel(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="flex justify-between mb-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                              <button
                                key={value}
                                onClick={() => handleRateMovie(value)}
                                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs 
                                  ${
                                    rating === value
                                      ? "bg-yellow-500 text-black"
                                      : "bg-gray-700 text-white hover:bg-gray-600"
                                  }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>

                          {rating && (
                            <button
                              onClick={handleDeleteRating}
                              className="mt-2 text-xs text-red-400 hover:text-red-300 self-end"
                            >
                              Remove rating
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Overview</h3>
                  <p className="max-w-xl text-gray-200">{movie?.overview}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-10 py-8">
            <div className="max-w-7xl mx-auto px-8 py-10">
              <h1 className="text-3xl font-bold mb-8">Recommendations</h1>
              <div className="relative">
                <div className="overflow-x-auto bg-black pb-6 custom-scrollbar">
                  <div className="flex gap-6 pb-2">
                    {recommendations.map((movie, id) => (
                      <div key={id} className="flex-shrink-0 w-36 md:w-44">
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </>
      )}
    </div>
  );
}
