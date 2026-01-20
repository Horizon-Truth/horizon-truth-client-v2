import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '../store/auth.store';

const API_URL = import.meta.env.VITE_API_URL;