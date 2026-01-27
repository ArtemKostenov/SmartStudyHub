import api from './axiosInstance';
import type { Note } from '../types/note';

export interface CreateNoteDto {
    title: string;
    content: string;
    userId: number;
}

export const notesApi = {
    getAll: async () => {
        const response = await api.get<Note[]>('/notes');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Note>(`/notes/${id}`);
        return response.data;
    },

    create: async (data: CreateNoteDto) => {
        const response = await api.post<Note>('/notes', data);
        return response.data;
    }
}