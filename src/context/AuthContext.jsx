import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();
import BASE_URL from "../config";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/refresh`, {
        withCredentials: true,
      });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
      }
      return null;
    } catch (err) {
      console.error("Session expired. Please log in again.");
      signOut(); // Auto logout if refresh fails
      return null;
    }
  }, []);

  // ✅ Attach access token to all requests
  API.interceptors.request.use(
    async (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Auto-refresh token on 401 response
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.warn("Token expired, refreshing...");
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return API.request(error.config); // Retry failed request
        }
      }
      return Promise.reject(error);
    }
  );

  const signIn = async (email, password) => {
    try {
      const response = await API.post("/api/auth/login", { email, password });

      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("accessToken", response.data.accessToken);
      setError("");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const signOut = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          setUser(storedUser);
        } else {
          console.warn("Failed to refresh token, user needs to log in again.");
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, signIn, signOut, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
