export default function Navbar() {
  return (
    <nav className="bg-blue-400 text-white py-3">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div className="font-bold text-lg tracking-wider">CINEMA</div>
        <div className="flex gap-6">
          <button className="hover:underline">Favorite</button>
          <button className="hover:underline">Watchlist</button>
        </div>
      </div>
    </nav>
  );
}
