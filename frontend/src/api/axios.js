import axios from 'axios';
//create an axios instance with a base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accesstoken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
error => {
  return Promise.reject(error);

});

// Add a response interceptor to handle token refresh

instance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` } }
        );

        const newAccessToken = refreshRes.data.access_token;
        localStorage.setItem('accesstoken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error("Refresh failed:", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
