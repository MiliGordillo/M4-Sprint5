import axios from "axios";

const BASE_URL = "https://6897eb7cddf05523e55dc2d9.mockapi.io/"; // <- reemplaza

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
