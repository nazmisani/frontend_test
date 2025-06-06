import type { MovieProps } from "../types/index";

export default function MovieCard({ movie }: MovieProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover"
      />
      <div className="p-3">
        <h2 className="text-sm font-semibold truncate text-white">
          {movie.title}
        </h2>
        <p className="text-xs text-gray-400">
          {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </div>
  );
}
