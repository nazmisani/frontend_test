import { useParams } from "react-router";
import tmdb from "../api/tmdb";
import { useEffect, useState } from "react";

import type { MovieDetailType } from "../types";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetail() {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const { movie_id } = useParams();

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
    try {
      const response = await tmdb.post(`/account/22055744/favorite`, {
        media_type: "movie",
        media_id: movie?.id,
        favorite: !isFavorite,
      });

      console.log("Favorite Success:", response.data);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  }

  async function toggleWatchlist() {
    try {
      const response = await tmdb.post(`/account/22055744/watchlist`, {
        media_type: "movie",
        media_id: movie?.id,
        watchlist: !isWatchlist,
      });

      console.log("Watchlist Success:", response.data);
      setIsWatchlist(!isWatchlist);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  }
  useEffect(() => {
    setLoading(true);
    fetchMovieDetail();
    fetchRecommendations();
  }, [movie_id]); // Fixed dependency array to prevent infinite loop

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

                {/* Rating and Action Buttons - Similar to the image */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="bg-gray-800 rounded-full p-2 flex items-center justify-center">
                    <span className="text-green-400 font-bold">
                      {movie?.vote_average
                        ? `${Math.round(movie.vote_average * 10)}%`
                        : "N/A"}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={toggleFavorite}
                    className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFavorite ? (
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
                    )}
                  </button>

                  {/* Watchlist Button */}
                  <button
                    onClick={toggleWatchlist}
                    className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                    aria-label={
                      isWatchlist ? "Remove from watchlist" : "Add to watchlist"
                    }
                  >
                    {isWatchlist ? (
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
                  </button>
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
