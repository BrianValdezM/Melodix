import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:8080/api/playlists';
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getPlaylists = () => axios.get(API, { headers: headers() });
export const createPlaylist = (data) => axios.post(API, data, { headers: headers() });
export const addSongToPlaylist = (playlistId, songId) => axios.post(`${API}/${playlistId}/songs/${songId}`, {}, { headers: headers() });
export const removeSongFromPlaylist = (playlistId, songId) => axios.delete(`${API}/${playlistId}/songs/${songId}`, { headers: headers() });
export const deletePlaylist = (id) => axios.delete(`${API}/${id}`, { headers: headers() });