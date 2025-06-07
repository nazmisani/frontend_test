import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMovieContext } from "../context/MovieContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const { login, isAuthenticated, error } = useMovieContext();

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkAuth();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    setLoginLoading(true);
    await login(username, password);
    setLoginLoading(false);
  };

  return (
    <>
      {" "}
      {loading ? (
        <div className="h-screen flex flex-col items-center justify-center bg-black">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">
            Verifying authentication status...
          </p>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-black text-white">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6">Login to TMDB</h1>{" "}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded mb-4">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>{" "}
              <div className="mt-4 text-sm text-gray-400">
                <p className="text-center mb-2">
                  Use your TMDB account credentials to login
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You need a TMDB account to use this app's features</li>
                  <li>
                    If you don't have one, you can{" "}
                    <a
                      href="https://www.themoviedb.org/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      sign up for free at themoviedb.org
                    </a>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
