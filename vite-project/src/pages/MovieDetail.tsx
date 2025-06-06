import { useParams } from "react-router";
import tmdb from "../api/tmdb";
import { useEffect, useState } from "react";

import type { MovieDetailType } from "../types";
import MovieCard from "../components/MovieCard";

export default function MovieDetail() {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [recommendations, setRecommendations] = useState([]);
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
    }
  }

  useEffect(() => {
    fetchMovieDetail();
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
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
            <p className="mt-4 max-w-xl text-gray-200">{movie?.overview}</p>
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
        </div>
      </div>
    </div>
  );
}
