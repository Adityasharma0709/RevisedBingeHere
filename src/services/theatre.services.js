const API_URL = "http://localhost:3000/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

export const getTheatres = async () => {
  const response = await fetch(`${API_URL}/theatres`);
  return parseResponse(response);
};

export const createTheatre = async ({ theatreData, userId }) => {
  const response = await fetch(`${API_URL}/theatres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
    body: JSON.stringify(theatreData),
  });

  return parseResponse(response);
};

export const createScreen = async ({ screenData, userId }) => {
  const response = await fetch(`${API_URL}/screens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
    body: JSON.stringify(screenData),
  });

  return parseResponse(response);
};

export const getTheatresByOwner = async (userId) => {
  const response = await fetch(`${API_URL}/theatre/${userId}`, {
    headers: {
      userid: userId,
    },
  });
  return parseResponse(response);
};
