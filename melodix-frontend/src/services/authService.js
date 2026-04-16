import axios from 'axios';

const API = 'http://localhost:8080/api/auth';

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);
export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const setRole = (role) => localStorage.setItem('role', role);
export const isAdmin = () => localStorage.getItem('role') === 'ADMIN';
export const isArtist = () => localStorage.getItem('role') === 'ARTIST' || localStorage.getItem('role') === 'ADMIN';