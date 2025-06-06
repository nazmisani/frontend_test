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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">Now Playing</h1>
        <div className="relative">
          <div className="overflow-x-auto bg-black pb-6 custom-scrollbar">
            <div className="flex gap-6 pb-2">
              {movies.map((movie, id) => (
                <div key={id} className="flex-shrink-0 w-36 md:w-44">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
