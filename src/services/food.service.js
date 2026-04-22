const API_URL = "http://localhost:3000/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

export const getFoods = async ({ theatreId, available } = {}) => {
  const params = new URLSearchParams();

  if (theatreId) params.set("theatreId", theatreId);
  if (available !== undefined) params.set("available", String(available));

  const query = params.toString();
  const response = await fetch(`${API_URL}/foods${query ? `?${query}` : ""}`);

  return parseResponse(response);
};

export const createFood = async ({ foodData, userId }) => {
  const response = await fetch(`${API_URL}/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
    body: JSON.stringify(foodData),
  });

  return parseResponse(response);
};
