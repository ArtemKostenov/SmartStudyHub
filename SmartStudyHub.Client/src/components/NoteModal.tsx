import { useEffect, useState } from 'react';
import { notesApi } from '../api/notesApi';
import type { Note } from '../types/note';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    noteToEdit?: Note | null;
}

export const NoteModal = ({ isOpen, onClose, onSaved, noteToEdit }: Props) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (noteToEdit) {
                setTitle(noteToEdit.title);
                setContent(noteToEdit.content);
            } else {
                setTitle('');
                setContent('');
            }
        }
    }, [isOpen, noteToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (noteToEdit){
                await notesApi.update(noteToEdit.id, { title, content });
            } else {
                await notesApi.create({ title, content });
            }

            onSaved();
            onClose();
        } catch (error) {
            alert('Ошибка при сохранении');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{noteToEdit ? 'Редактирование заметки' : 'Новая заметка'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-hidden">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Моя заметка"
                            required 
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                            placeholder="Описание заметки..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
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
                            {isSubmitting ? 'Сохранение' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}