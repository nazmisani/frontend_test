export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">CINEMA</div>
      <div className="flex gap-4">
        <button className="hover:underline">Favorite</button>
        <button className="hover:underline">Watchlist</button>
      </div>
    </nav>
  );
}
