import MovieCard from "../components/MovieCard";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex justify-center px-6 py-10 text-white">
        <div className="w-full max-w-7xl pl-10">
          <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <MovieCard />
            <MovieCard />
            <MovieCard />
            <MovieCard />
            <MovieCard />
            <MovieCard />
            <MovieCard />
            {/* ... */}
          </div>
        </div>
      </div>
    </>
  );
}
