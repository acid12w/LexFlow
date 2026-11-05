import axios, { isCancel, AxiosError } from "axios";

// Host only, e.g. https://lexflow-1-4ai4.onrender.com (set in client/.env.local
// for local dev, and in your host's environment settings for production)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Required for HTTP-only cookies/sessions
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // clear client state
      // localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);
