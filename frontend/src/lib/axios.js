import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "https://mern-tutorial-gfl2.onrender.com/api"; 

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
