import { useState } from "react";
import type { CreateTaskDto } from "../types/task";
import { tasksApi } from "../api/taskApi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newTask: CreateTaskDto = {
                title,
                description: description || undefined,
                dueDate: dueDate || undefined
            };

            await tasksApi.create(newTask);

            setTitle('');
            setDescription('');
            setDueDate('');

            onTaskCreated();
            onClose();
        } catch (error) {
            alert('Ошибка при создании задачи');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Новая задача</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название задачи</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Моя задача"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание (необязательно)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                            placeholder="Детали задачи..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mt-1">Дедлайн</label>
                        <input
                           type="date"
                           value={dueDate}
                           onChange={(e) => setDueDate(e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        /> 
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Создание' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};