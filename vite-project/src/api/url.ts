export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export const getImageUrl = (
  path: string | null,
  size: string = "w500"
): string => {
  if (!path) return "/placeholder-image.png";
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const getPosterUrl = (path: string | null): string => {
  return getImageUrl(path, "w500");
};

export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, "original");
};

export const getProfileUrl = (path: string | null): string => {
  return getImageUrl(path, "w185");
};
