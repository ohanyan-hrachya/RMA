import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

// Inject JWT on every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Normalize errors
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const normalized = {
            status: error.response?.status ?? 500,
            message: error.response?.data?.message ?? "An unexpected error occurred",
            errors: error.response?.data?.errors ?? {},
        };
        return Promise.reject(normalized);
    },
);
