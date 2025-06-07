import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import tmdb from "../api/tmdb";
import type { Movie } from "../types";

interface MovieContextType {
  favorites: Movie[];
  watchlist: Movie[];
  isAuthenticated: boolean;
  sessionId: string | null;
  accountId: number | null;
  user: { username: string; name: string } | null;
  isLoading: boolean;
  error: string | null;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movie: Movie) => Promise<void>;
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (movie: Movie) => Promise<void>;
  rateMovie: (movieId: number, rating: number) => Promise<void>;
  deleteRating: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  createRequestToken: () => Promise<string>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

export function MovieProvider({ children }: MovieProviderProps) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [user, setUser] = useState<{ username: string; name: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("tmdb_session_id");
    const storedAccountId = localStorage.getItem("tmdb_account_id");
    const storedUser = localStorage.getItem("tmdb_user");

    if (storedSessionId) {
      setSessionId(storedSessionId);
      setIsAuthenticated(true);

      if (storedAccountId) {
        setAccountId(Number(storedAccountId));
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      fetchUserLists(storedSessionId);
    } else {
      setIsLoading(false);
    }
  }, []);
  const fetchUserLists = async (sid: string) => {
    setIsLoading(true);
    try {
      const accountResponse = await tmdb.get("/account", {
        params: { session_id: sid },
        timeout: 10000,
      });

      if (!accountResponse.data.id) {
        throw new Error(
          "Account information not found. Session may be invalid."
        );
      }

      const accId = accountResponse.data.id;
      setAccountId(accId);
      localStorage.setItem("tmdb_account_id", String(accId));

      const username = accountResponse.data.username || "";
      const name = accountResponse.data.name || username;
      setUser({ username, name });
      localStorage.setItem("tmdb_user", JSON.stringify({ username, name }));

      const [favoritesResponse, watchlistResponse] = await Promise.all([
        tmdb.get(`/account/${accId}/favorite/movies`, {
          params: { session_id: sid },
          timeout: 10000,
        }),
        tmdb.get(`/account/${accId}/watchlist/movies`, {
          params: { session_id: sid },
          timeout: 10000,
        }),
      ]);

      setFavorites(favoritesResponse.data.results || []);
      setWatchlist(watchlistResponse.data.results || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching user data:", err);

      if (err.code === "ECONNABORTED") {
        setError(
          "Connection timed out while fetching your data. Please check your internet connection."
        );
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        logout();
      } else if (!navigator.onLine) {
        setError(
          "You appear to be offline. Please check your internet connection."
        );
      } else {
        setError(
          err.message || "Failed to fetch user data. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const createRequestToken = async (): Promise<string> => {
    try {
      const response = await tmdb.get("/authentication/token/new");
      if (!response.data.success) {
        throw new Error(
          "TMDB API returned unsuccessful response for token creation"
        );
      }
      return response.data.request_token;
    } catch (err: any) {
      console.error("Request token creation error:", err);
      const errorMessage =
        err.response?.data?.status_message ||
        "Failed to create request token. Please check your internet connection and try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  const validateWithLogin = async (
    username: string,
    password: string,
    requestToken: string
  ): Promise<string> => {
    try {
      const response = await tmdb.post(
        "/authentication/token/validate_with_login",
        {
          username,
          password,
          request_token: requestToken,
        }
      );
      return response.data.request_token;
    } catch (err: any) {
      console.error("Login validation error:", err);
      const errorMessage =
        err.response?.data?.status_message ||
        (err.response?.status === 401
          ? "Authentication failed. Please check your username and password."
          : "Invalid username or password");
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  const createSession = async (requestToken: string): Promise<string> => {
    try {
      const response = await tmdb.post("/authentication/session/new", {
        request_token: requestToken,
      });
      return response.data.session_id;
    } catch (err: any) {
      console.error("Session creation error:", err);
      const errorMessage =
        err.response?.data?.status_message ||
        "Failed to create session. Your login session may have expired.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Creating request token...");
      const requestToken = await createRequestToken();

      console.log("Validating token with credentials...");
      const validatedToken = await validateWithLogin(
        username,
        password,
        requestToken
      );

      console.log("Creating session with validated token...");
      const newSessionId = await createSession(validatedToken);

      setSessionId(newSessionId);
      localStorage.setItem("tmdb_session_id", newSessionId);
      setIsAuthenticated(true);

      console.log("Fetching user lists and account information...");
      await fetchUserLists(newSessionId);
    } catch (err: any) {
      console.error("Login process error:", err);
      if (err.message?.includes("request token")) {
        setError("Connection issue with TMDB API. Please try again later.");
      } else if (
        err.message?.includes("Authentication failed") ||
        err.message?.includes("Invalid username")
      ) {
        setError(
          err.message ||
            "Invalid username or password. Please check your credentials."
        );
      } else if (err.message?.includes("session")) {
        setError("Failed to create session. Please try again.");
      } else {
        setError(err.message || "Failed to login. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (sessionId) {
      tmdb
        .delete("/authentication/session", {
          data: { session_id: sessionId },
        })
        .catch((err) => console.error("Error deleting session:", err));
    }

    setSessionId(null);
    setAccountId(null);
    setIsAuthenticated(false);
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    localStorage.removeItem("tmdb_session_id");
    localStorage.removeItem("tmdb_account_id");
    localStorage.removeItem("tmdb_user");
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const isInWatchlist = (movieId: number): boolean => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const addToFavorites = async (movie: Movie): Promise<void> => {
    if (!isAuthenticated || !accountId) {
      setError("You must be logged in to add favorites");
      return;
    }

    try {
      await tmdb.post(
        `/account/${accountId}/favorite`,
        {
          media_type: "movie",
          media_id: movie.id,
          favorite: true,
        },
        {
          params: { session_id: sessionId },
        }
      );

      setFavorites((prev) => [...prev, movie]);
    } catch (err: any) {
      setError(err.message || "Failed to add to favorites");
      console.error("Error adding to favorites:", err);
    }
  };

  const removeFromFavorites = async (movie: Movie): Promise<void> => {
    if (!isAuthenticated || !accountId) {
      setError("You must be logged in to remove favorites");
      return;
    }

    try {
      await tmdb.post(
        `/account/${accountId}/favorite`,
        {
          media_type: "movie",
          media_id: movie.id,
          favorite: false,
        },
        {
          params: { session_id: sessionId },
        }
      );

      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
    } catch (err: any) {
      setError(err.message || "Failed to remove from favorites");
      console.error("Error removing from favorites:", err);
    }
  };

  const addToWatchlist = async (movie: Movie): Promise<void> => {
    if (!isAuthenticated || !accountId) {
      setError("You must be logged in to add to watchlist");
      return;
    }

    try {
      await tmdb.post(
        `/account/${accountId}/watchlist`,
        {
          media_type: "movie",
          media_id: movie.id,
          watchlist: true,
        },
        {
          params: { session_id: sessionId },
        }
      );

      setWatchlist((prev) => [...prev, movie]);
    } catch (err: any) {
      setError(err.message || "Failed to add to watchlist");
      console.error("Error adding to watchlist:", err);
    }
  };

  const removeFromWatchlist = async (movie: Movie): Promise<void> => {
    if (!isAuthenticated || !accountId) {
      setError("You must be logged in to remove from watchlist");
      return;
    }

    try {
      await tmdb.post(
        `/account/${accountId}/watchlist`,
        {
          media_type: "movie",
          media_id: movie.id,
          watchlist: false,
        },
        {
          params: { session_id: sessionId },
        }
      );

      setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
    } catch (err: any) {
      setError(err.message || "Failed to remove from watchlist");
      console.error("Error removing from watchlist:", err);
    }
  };
  const rateMovie = async (movieId: number, rating: number): Promise<void> => {
    if (!isAuthenticated || !sessionId) {
      setError("You must be logged in to rate movies");
      return;
    }

    try {
      await tmdb.post(
        `/movie/${movieId}/rating`,
        {
          value: rating,
        },
        {
          params: { session_id: sessionId },
        }
      );
    } catch (err: any) {
      setError(err.message || "Failed to rate movie");
      console.error("Error rating movie:", err);
    }
  };

  const deleteRating = async (movieId: number): Promise<void> => {
    if (!isAuthenticated || !sessionId) {
      setError("You must be logged in to delete ratings");
      return;
    }

    try {
      await tmdb.delete(`/movie/${movieId}/rating`, {
        params: { session_id: sessionId },
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete rating");
      console.error("Error deleting rating:", err);
    }
  };

  const value = {
    favorites,
    watchlist,
    isAuthenticated,
    sessionId,
    accountId,
    user,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    rateMovie,
    deleteRating,
    isFavorite,
    isInWatchlist,
    login,
    logout,
    createRequestToken,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
}
