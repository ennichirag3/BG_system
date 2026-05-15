import axios from "axios";

const API = axios.create({
  baseURL: "https://bg-system-3.onrender.com/api",
});

export default API;