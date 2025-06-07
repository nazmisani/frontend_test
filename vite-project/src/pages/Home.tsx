import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import tmdb from "../api/tmdb";

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNowPlaying() {
    try {
      const response = await tmdb.get("/movie/now_playing");
      setNowPlayingMovies(response.data?.results);
    } catch (error) {
      console.error("Error fetching Movies:", error);
    }
  }

  async function fecthTopRated() {
    try {
      const response = await tmdb.get("movie/top_rated");
      setTopRated(response.data?.results);
      console.log(response.data?.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchNowPlaying();
    fecthTopRated();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Now Playing Start */}
          <div className="max-w-7xl mx-auto px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Now Playing</h1>
            <div className="relative">
              <div className="overflow-x-auto bg-black pb-6 custom-scrollbar">
                <div className="flex gap-6 pb-2">
                  {nowPlayingMovies.map((movie, id) => (
                    <div key={id} className="flex-shrink-0 w-36 md:w-44">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Now Playing End */}

          {/* Top Rated Start */}
          <div className="max-w-7xl mx-auto px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Top Rated</h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
              {topRated.map((movie, id) => (
                <div key={id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
          {/* Top Rated End */}
        </>
      )}
    </div>
  );
}
