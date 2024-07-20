import axios from 'axios';
import { API_KEY, BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: { Authorization: `Bearer ${API_KEY}` },
});

api.interceptors.request.use(
  (config) => {
    const configuration = { ...config };
    const { params } = configuration;

    configuration.params = {
      ...params,
      language: 'pt-BR',
      region: 'BR',
    };

    return configuration;
  },
  (e) => Promise.reject(e)
);

export default api;
