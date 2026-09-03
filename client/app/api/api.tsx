import axios, { isCancel, AxiosError } from "axios";

export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true, // Required for HTTP-only cookies/sessions
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log(error);
      // clear client state
      // localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);
