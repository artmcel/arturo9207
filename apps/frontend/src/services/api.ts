import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('sisu_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('sisu_token');
          localStorage.removeItem('sisu_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config = {}) {
    const response = await this.client.get<T>(url, config);
    return response;
  }

  async post<T>(url: string, data = {}, config = {}) {
    const response = await this.client.post<T>(url, data, config);
    return response;
  }

  async put<T>(url: string, data = {}, config = {}) {
    const response = await this.client.put<T>(url, data, config);
    return response;
  }

  async delete<T>(url: string, config = {}) {
    const response = await this.client.delete<T>(url, config);
    return response;
  }
}

export const api = new ApiClient();