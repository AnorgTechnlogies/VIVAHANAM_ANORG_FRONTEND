import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

console.log("BASE_URL : ", BASE_URL);

const initialState = {
  loading: true, // Start with loading true to prevent flash
  error: null,
  message: null,
  user: null,
  isAuthenticated: false,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;  // Don't auth yet (wait for verify)
      state.user = null;  // Or partial user if needed
      state.token = null;
      state.message = action.payload.message;  // e.g., "Verification code sent"
      state.error = null;
    },
    verifySuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;  // From verify response
      state.token = action.payload.token;
      state.message = action.payload.message;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;  // Fixed: was result, but backend uses user
      state.token = action.payload.token;
      state.message = action.payload.message;
      state.error = null;
    },
    userProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;  // Fixed: was result, align with backend
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;  // Fixed: was result
      state.message = action.payload.message;
      state.error = null;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.message = "Logged out successfully";
      state.error = null;
    },
    userFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    clearErrors(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
    initializeAuth(state, action) {
      state.loading = false;
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;  // Fixed: was result
        state.token = action.payload.token;
        state.error = null;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
  },
});

// Register User
export const registerUser = (userData) => async (dispatch) => {
  console.log("User Data : ", userData);
 
  try {
    dispatch(userSlice.actions.userRequest());
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
   
    const response = await axios.post(
      `${BASE_URL}/api/user/register`,
      userData,  // Fixed: Removed duplicate URL from body
      config
    );
   
    dispatch(userSlice.actions.registerSuccess(response.data));
   
    // No token storage here (handled after verify)
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Registration failed"
      )
    );
  }
};

// Verify Email
export const verifyEmail = (email, otp) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.userRequest());
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const response = await axios.post(
      `${BASE_URL}/api/user/verify-email`,  // Match route
      { email, verificationCode: otp },
      config
    );
    dispatch(userSlice.actions.verifySuccess(response.data));
    if (response.data.token) {
      localStorage.setItem("vivahanamToken", response.data.token);
    }
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Verification failed"
      )
    );
  }
};

// Login User
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.userRequest());
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    
    const response = await axios.post(
      `${BASE_URL}/api/user/login`,
      credentials,
      config
    );
    
    dispatch(userSlice.actions.loginSuccess(response.data));
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("vivahanamToken", response.data.token);
    }
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Login failed"
      )
    );
  }
};

// Get User Profile
export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.userRequest());
    const token = localStorage.getItem("vivahanamToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };
    
    const response = await axios.get(
      `${BASE_URL}/api/user/profile`,
      config
    );
    
    dispatch(userSlice.actions.userProfileSuccess(response.data));
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Failed to fetch profile"
      )
    );
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.userRequest());
    const token = localStorage.getItem("vivahanamToken");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    
    const response = await axios.put(
      `${BASE_URL}/api/user/profile`,
      userData,
      config
    );
    
    dispatch(userSlice.actions.updateProfileSuccess(response.data));
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Failed to update profile"
      )
    );
  }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.userRequest());
    const token = localStorage.getItem("vivahanamToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };
    
    await axios.post(`${BASE_URL}/api/user/logout`, {}, config);
    
    // Remove token from localStorage
    localStorage.removeItem("vivahanamToken");
    
    dispatch(userSlice.actions.logoutSuccess());
  } catch (error) {
    dispatch(
      userSlice.actions.userFailed(
        error.response?.data?.message || "Logout failed"
      )
    );
  }
};

// Utility actions
export const clearErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearErrors());
};
export const clearMessage = () => (dispatch) => {
  dispatch(userSlice.actions.clearMessage());
};

// Initialize authentication on app load
export const initializeAuth = () => async (dispatch) => {
  const token = localStorage.getItem("vivahanamToken");
 
  console.log("Initializing auth, token found:", !!token);
 
  if (token) {
    try {
      dispatch(userSlice.actions.userRequest());
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
     
      console.log("Making profile request with token");
      const response = await axios.get(
        `${BASE_URL}/api/user/profile`,
        config
      );
     
      console.log("Profile response:", response.data);
      dispatch(userSlice.actions.initializeAuth({
        user: response.data.user,  // Fixed: was result
        token: token
      }));
    } catch (error) {
      console.error("Token validation failed:", error.response?.data || error.message);
      // Token is invalid, remove it
      localStorage.removeItem("vivahanamToken");
      dispatch(userSlice.actions.userFailed("Session expired"));
    }
  } else {
    console.log("No token found, user not authenticated");
    dispatch(userSlice.actions.initializeAuth(null));
  }
};

export default userSlice.reducer;