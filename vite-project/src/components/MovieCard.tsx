import type { MovieProps } from "../types/index";

export default function MovieCard({ movie }: MovieProps) {
  return (
    <div className="bg-[#1f1f1f] rounded-lg overflow-hidden shadow-md w-[160px]">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[240px] object-cover"
      />
      <div className="p-2">
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
