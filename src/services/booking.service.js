const API_URL = "http://localhost:3000/api/bookings";

export const createBooking = async (bookingData, userId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
    body: JSON.stringify(bookingData),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || result.message || "Failed to create booking");
  }

  return result;
};

export const getUserBookings = async (userId) => {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      userid: userId,
    },
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || result.message || "Failed to fetch bookings");
  }

  return result;
};
