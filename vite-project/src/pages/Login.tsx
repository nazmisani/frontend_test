import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate login authentication check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center bg-black">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-black text-white">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <div className="text-center">Login form would go here</div>
          </div>
        </div>
      )}
    </>
  );
}
