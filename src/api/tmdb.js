const API_KEY = "f8d8af9b93211b253d70ae529ad78ce1";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovieDetails = async (movieId) => {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};

export const fetchMovieCredits = async (movieId) => {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
};
