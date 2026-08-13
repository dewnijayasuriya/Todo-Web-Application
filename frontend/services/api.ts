import axios from "axios";

const api = axios.create({ // create an reusable axios instance
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor:Runs before every API request and automatically attaches the authenticated users's sanctum token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");

      if (token) {
        const headers = config.headers ?? {};
        (headers as Record<string, string>).Authorization = `Bearer ${token}`;
        config.headers = headers;
      }
    }

    // Let axios set the multipart boundary itself for FormData payloads
    // instead of the instance's default application/json content type.
    if (config.data instanceof FormData && config.headers) {
      delete (config.headers as Record<string, string>)["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
