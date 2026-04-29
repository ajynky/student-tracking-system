import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9091';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const row = document.cookie.split('; ').find(row => row.startsWith('token='));
    return row ? row.substring('token='.length) : null;
};

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;