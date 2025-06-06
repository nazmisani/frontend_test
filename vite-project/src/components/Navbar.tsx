import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-400 text-white py-3">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div className="font-bold text-lg tracking-wider">CINEMA</div>
        <div className="flex gap-6">
          <Link to={"/favorite"} className="hover:underline">
            Favorite
          </Link>
          <Link to={"/watchlist"} className="hover:underline">
            Watchlist
          </Link>
        </div>
      </div>
    </nav>
  );
}
