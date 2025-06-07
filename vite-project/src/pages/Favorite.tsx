import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import tmdb from "../api/tmdb";

export default function Favorite() {
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFavorite() {
    try {
      const response = await tmdb.get("account/22055744/favorite/movies");
      setFavorite(response.data?.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchFavorite();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Favorites</h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
              {favorite.map((movie, id) => (
                <div key={id}>
                  <MovieCard movie={movie} />
                </div>
              ))}{" "}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
