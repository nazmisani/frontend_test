export default function MovieCard() {
  return (
    <div className="bg-[#1f1f1f] rounded-lg overflow-hidden shadow-md w-[160px]">
      <img
        src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
        alt="Wonder Woman 1984"
        className="w-full h-[240px] object-cover"
      />
      <div className="p-2">
        <h2 className="text-sm font-semibold truncate text-white">
          Wonder Woman 1984
        </h2>
        <p className="text-xs text-gray-400">2020</p>
      </div>
    </div>
  );
}
