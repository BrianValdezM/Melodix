import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:8080/api/songs';

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getAllSongs = () => axios.get(API, { headers: headers() });
export const searchSongs = (query) => axios.get(`${API}/search?title=${query}`, { headers: headers() });
export const searchByArtist = (artist) => axios.get(`${API}/search?artist=${artist}`, { headers: headers() });
export const getTopSongs = () => axios.get(`${API}/top`, { headers: headers() });
export const streamUrl = (id) => `http://localhost:8080/api/songs/${id}/stream`;
export const uploadSong = (formData) => axios.post(API, formData, { headers: { ...headers(), 'Content-Type': 'multipart/form-data' } });