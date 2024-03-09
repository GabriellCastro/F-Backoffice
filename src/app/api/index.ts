import axios from "axios";
import { publicRoutes } from "../utils/constants/routes";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      !publicRoutes.includes(window.location.href)
    ) {
      window.location.href = "/login";
      return;
    }

    return Promise.reject(error);
  }
);
