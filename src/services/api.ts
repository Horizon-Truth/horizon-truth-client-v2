import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '../store/auth.store';

const API_URL = import.meta.env.VITE_API_URL;

console.log("API _ URL : ",API_URL)
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});