import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = async (data) => {
  return await axios.post(`${API}/login`, data);
};

export const register = async (data) => {
  return await axios.post(`${API}/register`, data);
};
