const API_URL = "http://localhost:3000/api";

export const registerUser = async (userData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (payload) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_URL}/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update password failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
