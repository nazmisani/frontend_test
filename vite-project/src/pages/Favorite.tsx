import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import tmdb from "../api/tmdb";

export default function Favorite() {
  const [favorite, setFavorite] = useState([]);

  async function fecthFavorite() {
    try {
      const response = await tmdb.get("account/22055744/favorite/movies");
      setFavorite(response.data?.results);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fecthFavorite();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Favorites</h1>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
            {favorite.map((movie, id) => (
              <div key={id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
