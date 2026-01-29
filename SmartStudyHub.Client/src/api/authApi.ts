import api from './axiosInstance';
import type { AuthResponse, LoginDto, RegisterDto } from '../types/auth';

export const authApi = {
    register: async (data: RegisterDto) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginDto) => {
        const response = await api.post<AuthResponse>('/api/login', data);
        return response.data;
    }
}