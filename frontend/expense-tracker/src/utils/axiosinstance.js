import axios from "axios"; // Import the Axios HTTP client
import { BASE_URL } from "./apiPaths"; // Import the base URL from a config file

// Create a custom axios instance with default settings
const axiosInstance = axios.create({
    baseURL: BASE_URL,           // All requests will use this base URL
    timeout: 10000,              // Request timeout set to 10 seconds
    headers: {
        "Content-Type": "application/json", // Send data as JSON
        Accept: "application/json",         // Expect JSON response
    }
});

// ===== Request Interceptor =====
// This runs before each request is sent
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token"); // Retrieve JWT token from local storage

        if (accessToken) {
            // Add Authorization header if token exists
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config; // Return the modified config so request can continue
    },
    (error) => {
        // If there's an error while setting up request
        return Promise.reject(error);
    }
);

// ===== Response Interceptor =====
// This runs after each response is received
axiosInstance.interceptors.response.use(
    (response) => {
        // Simply return the response if successful
        return response;
    },
    (error) => {
        // Handle specific HTTP error responses
        if (error.response) {
            if (error.response.status === 401) {
                // Unauthorized → redirect user to login page
                window.location.href = "/login";
            }
            else if (error.response.status === 500) {
                // Internal server error → log an error message
                console.error("Server error, please try again later");
            }
        }
        // Handle network errors or timeouts
        else if (error.code === "ECONNABORTED") {
            console.error("Request timeout, please try again");
        }

        // Always reject so the calling function can handle the error
        return Promise.reject(error);
    }
);

export default axiosInstance; // Export the configured axios instance

