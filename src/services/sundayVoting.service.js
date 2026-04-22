const API_URL = "http://localhost:3000/api/sunday-voting";

// Get the current active voting session
export const getActiveSession = async (userId) => {
  const res = await fetch(`${API_URL}/active`, {
    headers: {
      userid: userId || "",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch active session");
  }
  return data;
};

// Cast a vote for a movie in the contenders list
export const castVote = async (tmdbId, userId) => {
  const res = await fetch(`${API_URL}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId || "",
    },
    body: JSON.stringify({ tmdbId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to cast vote");
  }
  return data;
};

// Nominate and vote for a new movie from TMDB
export const nominateMovie = async (movieData, userId) => {
  const res = await fetch(`${API_URL}/nominate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId || "",
    },
    body: JSON.stringify(movieData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to nominate movie");
  }
  return data;
};

// ADMIN: Add a single classic movie to the session
export const adminAddMovie = async (movie, userId) => {
  const res = await fetch(`${API_URL}/admin/add-movie`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId || "", // Admin ID
    },
    body: JSON.stringify(movie),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to add movie");
  }
  return data;
};

// ADMIN: Get extended session stats (e.g. view private nominations that are < 100 votes)
export const getAdminSessionStats = async (userId) => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: {
      userid: userId || "", // Admin ID
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch session stats");
  }
  return data;
};

// PUBLIC & OWNER: Get the winner of the most recently closed section
export const getSundayWinner = async () => {
  const res = await fetch(`${API_URL}/winner`);
  const data = await res.json();
  if (!res.ok) {
    // Return null if no winner exists, rather than throwing error
    if (res.status === 404) return null;
    throw new Error(data.error || data.message || "Failed to fetch Sunday Voting winner");
  }
  return data; // Backend returns the MovieDoc directly!
};
