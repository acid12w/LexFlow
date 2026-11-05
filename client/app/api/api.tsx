import axios, { isCancel, AxiosError } from "axios";

// Full API base URL including the /api/v1 prefix, e.g.
// https://lexflow-1-4ai4.onrender.com/api/v1 (set in client/.env.local for local
// dev, and in your host's environment settings for production)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1"
).replace(/\/+$/, "");

const AUTH_PATHS = ["/sign-in", "/sign-up", "/register", "/join-firm"];

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for HTTP-only cookies/sessions
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't bounce away from the auth pages: a wrong password also returns 401
    // and the page needs to stay put to show the error
    const onAuthPage =
      typeof window !== "undefined" &&
      AUTH_PATHS.some((path) => window.location.pathname.startsWith(path));

    if (error.response?.status === 401 && !onAuthPage) {
      // clear client state
      // localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  },
);
