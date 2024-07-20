export const API_KEY = import.meta.env.VITE_API_KEY;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';

export const SCOPES = {
  TRENDING: '/trending/all/week',
  MOVIE: {
    TOP_RATED: '/movie/top_rated',
    POPULAR: '/movie/popular',
  },
  TV: {
    TOP_RATED: '/tv/popular',
  },
};
