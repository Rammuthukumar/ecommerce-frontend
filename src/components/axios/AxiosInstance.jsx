import axios from "axios";


// Create an Axios instance
export const axiosInstance = axios.create({
    baseURL: "https://ecommerce-backend-28es.onrender.com",  // Update this with your backend URL
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(config);
        const token = localStorage.getItem("token"); // Retrieve token
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Attach token
            console.log(token);
        }
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
