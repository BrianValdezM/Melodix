import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:8080/api/favorites';
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getFavorites = () => axios.get(API, { headers: headers() });
export const toggleFavorite = (songId) => axios.post(`${API}/${songId}`, {}, { headers: headers() });
export const checkFavorite = (songId) => axios.get(`${API}/${songId}/check`, { headers: headers() });