import axios from "axios";

// base URL API
const API = "http://localhost:8080/api/users"; 

// Login
export const login = async (data) => {
  return await axios.post(`${API}/login`, data);
};

// Register
export const register = async (data) => {
  return await axios.post(`${API}/register`, data);
};
