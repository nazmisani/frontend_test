import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import tmdb from "../api/tmdb";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const response = await tmdb.get("/movie/now_playing");
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchNowPlaying();
  }, []);

  return (
    <div className="min-h-screen flex justify-center px-6 py-10 text-white bg-black">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 px-6">Now Playing</h1>

        <div className="overflow-x-auto bg-black px-6 scrollbar-hide">
          <div className="flex gap-6">
            {movies.map((movie, id) => (
              <div key={id} className="flex-shrink-0 w-48">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
