import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:8080/api/users';
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getProfile = () => axios.get(`${API}/me`, { headers: headers() });
export const updateProfile = (data) => axios.put(`${API}/me`, data, { headers: headers() });
export const uploadAvatar = (formData) => axios.post(`${API}/me/avatar`, formData, {
    headers: { ...headers(), 'Content-Type': 'multipart/form-data' }
});