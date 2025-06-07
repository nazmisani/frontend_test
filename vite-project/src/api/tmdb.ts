import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
  timeout: 15000,
});

tmdb.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      error.message =
        "Request timed out. Please check your internet connection and try again.";
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Authentication error (401):", error.response.data);
          break;
        case 404:
          console.error("Resource not found (404):", error.response.data);
          error.message = "The requested resource was not found.";
          break;
        case 429:
          console.error("Rate limit exceeded (429):", error.response.data);
          error.message = "Rate limit exceeded. Please try again later.";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          console.error(
            `Server error (${error.response.status}):`,
            error.response.data
          );
          error.message =
            "The TMDB server is currently unavailable. Please try again later.";
          break;
        default:
          console.error(
            `API error (${error.response.status}):`,
            error.response.data
          );
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      error.message =
        "No response from server. Please check your internet connection.";
    } else {
      console.error("Request error:", error.message);
      error.message = "An error occurred while making the request.";
    }

    return Promise.reject(error);
  }
);

export default tmdb;
