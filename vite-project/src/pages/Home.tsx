import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import tmdb from "../api/tmdb";
export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const response = await tmdb.get("/movie/now_playing"); // v4
        console.log(response.data);
        setMovies(response.data.results); // tergantung struktur respon
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchNowPlaying();
  }, []);

  return (
    <>
      <div className="min-h-screen flex justify-center px-6 py-10 text-white">
        <div className="w-full max-w-7xl pl-10">
          <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
            {movies.map((movie, id) => (
              <MovieCard movie={movie} key={id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
