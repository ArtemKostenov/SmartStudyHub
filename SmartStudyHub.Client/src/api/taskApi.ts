import api from './axiosInstance';
import type { Task, CreateTaskDto, TaskStatus } from '../types/task';

export const tasksApi = {
    getAll: async () => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    create: async (data: CreateTaskDto) => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    updateStatus: async (id: number, status: TaskStatus) => {
        await api.patch(`/tasks/${id}/status`, { status });
    },

    delete: async (id: number) => {
        await api.delete(`/tasks/${id}`);
    }
};