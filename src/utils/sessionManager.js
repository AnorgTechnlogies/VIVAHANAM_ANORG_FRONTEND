/**
 * Session Management Utility
 * Handles session termination and auto-logout
 */

const API_URL = import.meta.env.VITE_API_KEY;

/**
 * Check if response indicates session termination
 * @param {Response} response - Fetch response object
 * @returns {boolean} True if session is terminated
 */
export const isSessionTerminated = (response) => {
  return response.status === 401 && response.headers.get("content-type")?.includes("application/json");
};

/**
 * Handle session termination
 * Clears local storage and redirects to home
 */
export const handleSessionTermination = () => {
  // Clear all auth data
  localStorage.removeItem("vivahanamToken");
  localStorage.removeItem("vivahanamUser");
  
  // Show notification (if you have a notification system)
  if (window.showNotification) {
    window.showNotification({
      type: "error",
      message: "Your session has been terminated. Another device has logged in.",
    });
  } else {
    alert("Your session has been terminated. Another device has logged in. Please log in again.");
  }
  
  // Redirect to home
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

/**
 * Intercept fetch requests to handle session termination
 * Call this once in your app initialization
 */
export const setupSessionInterceptor = () => {
  // Store original fetch
  const originalFetch = window.fetch;

  // Override fetch
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Check if response indicates session termination
    if (isSessionTerminated(response)) {
      try {
        const data = await response.clone().json();
        if (data.code === "SESSION_TERMINATED" || data.message?.toLowerCase().includes("session terminated")) {
          handleSessionTermination();
          return response; // Return the response so the caller can handle it
        }
      } catch (e) {
        // Not JSON, ignore
      }
    }

    return response;
  };
};

/**
 * Setup axios interceptor (if using axios)
 * @param {AxiosInstance} axiosInstance - Axios instance
 */
export const setupAxiosInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        (error.response?.data?.code === "SESSION_TERMINATED" ||
          error.response?.data?.message?.toLowerCase().includes("session terminated"))
      ) {
        handleSessionTermination();
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Check session validity by making a test request
 * @returns {Promise<boolean>} True if session is valid
 */
export const checkSessionValidity = async () => {
  const token = localStorage.getItem("vivahanamToken");
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      if (data.code === "SESSION_TERMINATED") {
        handleSessionTermination();
        return false;
      }
    }

    return response.ok;
  } catch (error) {
    console.error("Session check error:", error);
    return false;
  }
};

