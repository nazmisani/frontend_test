import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMovieContext } from "../context/MovieContext";

export default function Favorite() {
  const { favorites, isLoading } = useMovieContext();

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Favorites</h1>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
                  Your favorites list is empty
                </p>
                <p className="text-gray-500 mt-2">
                  Add movies to your favorites to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {favorites.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
