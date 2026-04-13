const API_URL = "http://localhost:3000/api/movies";

// 🔍 Search movies (no auth needed)
export const searchMovies = async (query) => {
  const res = await fetch(`${API_URL}/search?query=${query}`);
  return res.json();
};

// 🎬 Create movie (ADMIN ONLY)
export const createMovie = async (data, userId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId, 
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    // The backend sends { error: "message" }, so we check result.error first
    throw new Error(result.error || result.message || "Failed to create movie");
  }

  return result;
};