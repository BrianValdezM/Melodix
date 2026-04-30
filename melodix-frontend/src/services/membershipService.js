import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:8080/api/membership';
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getMembership = () => axios.get(API, { headers: headers() });
export const subscribe = (data) => axios.post(`${API}/subscribe`, data, { headers: headers() });
export const getPaymentHistory = () => axios.get(`${API}/history`, { headers: headers() });
export const cancelMembership = () => axios.delete(`${API}/cancel`, { headers: headers() });