import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production' ? "api" : "http://localhost:5000/api";

// Create an Axios instance
const apiClient = axios.create({
  baseURL,
});

const logoutUser = () => {
  console.warn("🚨 Session Expired - Logging Out User...");
  alert("⚠️ Your session has expired. Please log in again.");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/signin"; // ✅ Redirect to login page
};

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

apiClient.interceptors.response.use(
  (response) => response, // ✅ Pass successful responses
  (error) => {
      if (error.response) {
          console.error("🔥 API Error:", error);
          console.error("❌ API Response Status:", error.response.status);

          if (error.response.status === 401) {
              logoutUser(); // ✅ Handle expired token by logging out user
          }
      } else {
          console.error("🚨 Network Error or No Response from Server");
      }
      return Promise.reject(error);
  }
);

export default apiClient;
