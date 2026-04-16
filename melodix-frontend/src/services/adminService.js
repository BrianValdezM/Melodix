import axios from 'axios';
import { getToken } from './authService';

const headers = () => ({ Authorization: `Bearer ${getToken()}` });
const SONGS = 'http://localhost:8080/api/songs';
const REQUESTS = 'http://localhost:8080/api/artist-requests';

export const getPendingSongs = () => axios.get(`${SONGS}/pending`, { headers: headers() });
export const approveSong = (id) => axios.post(`${SONGS}/${id}/approve`, {}, { headers: headers() });
export const rejectSong = (id, comment) => axios.post(`${SONGS}/${id}/reject`, { comment }, { headers: headers() });
export const getPendingArtists = () => axios.get(`${REQUESTS}/pending`, { headers: headers() });
export const getAllArtistRequests = () => axios.get(REQUESTS, { headers: headers() });
export const approveArtist = (id, comment) => axios.post(`${REQUESTS}/${id}/approve`, { comment }, { headers: headers() });
export const rejectArtist = (id, comment) => axios.post(`${REQUESTS}/${id}/reject`, { comment }, { headers: headers() });