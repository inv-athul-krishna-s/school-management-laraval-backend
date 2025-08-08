import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
error => {
  return Promise.reject(error);

});


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem("refreshToken")
    ) {
      console.log("Access token expired, attempting refresh...");
      error.config._retry = true;
      try {
        const res = await axios.post("http://localhost:8000/api/refresh-token", null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        });

        console.log("Refresh successful");

        const newAccessToken = res.data.access_token;
        localStorage.setItem("accessToken", newAccessToken);

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(error.config);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError.response?.data || refreshError.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
