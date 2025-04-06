import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({ baseURL: API_URL });

// Function to refresh the token
const refreshTokenFn = async () => {
  try {
    const response = await axiosInstance.post(`${API_URL}/token/refresh/`, {
      refresh: localStorage.getItem('refresh_token'), // Store refresh token securely
    });
    
    localStorage.setItem('access_token', response.data.access); // Update access token
    return response.data.access;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem('access_token'); // Clear tokens if refresh fails
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

// Axios request interceptor: Attach token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');

    if (!token) return config; // No token, proceed without it

    // Attach Authorization header
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor: Handle token expiration automatically
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      try {
        const newToken = await refreshTokenFn();
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the request
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
