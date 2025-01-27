import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend API URL
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized. Please log in again.");
      localStorage.removeItem("authToken"); // Clear token on 401
      window.location.href = "/signin"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiClient;
