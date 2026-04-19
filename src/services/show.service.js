const API_URL = "http://localhost:3000/api/shows";

export const getShowsByMovie = async (movieId, date) => {
  const url = date ? `${API_URL}/movie/${movieId}?date=${date}` : `${API_URL}/movie/${movieId}`;
  const res = await fetch(url);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || result.message);
  }

  return result;
};

export const createShow = async (showData, userId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
    body: JSON.stringify(showData),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || result.message || "Failed to create show");
  }

  return result;
};
