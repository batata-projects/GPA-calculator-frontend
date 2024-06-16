import axios, { AxiosInstance } from 'axios';

const httpClient: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
});

export default httpClient;
