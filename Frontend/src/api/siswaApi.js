import axios from "axios";
const API = "http://localhost:8080/api";

export const getKuisioner = () => axios.get(`${API}/kuisioner`);
export const submitKuisioner = (data) => axios.post(`${API}/kuisioner`, data);

export const getProfile = (id) => axios.get(`${API}/users/${id}`);
export const updateProfile = (id, data) => axios.put(`${API}/users/${id}`, data);

export const getAchievement = (id) => axios.get(`${API}/achievement/${id}`);
