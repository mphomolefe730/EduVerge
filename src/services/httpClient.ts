import axios from 'axios';
import { environment } from '../environment/environment';

const httpClient = axios.create({
  baseURL: environment.BackendApi,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default httpClient;