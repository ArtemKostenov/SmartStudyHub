import type { Note } from "../types/note";

interface Props {
    note: Note;
    onClick: (note: Note) => void;
    onDelete: (id: number) => void;
    onEdit: (note: Note) => void;
}

export const NoteCard = ({ note, onClick, onDelete, onEdit }: Props) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Вы точно хотите удалить эту заметку?")) {
            onDelete(note.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(note);
    };

    return (
        <div 
            onClick={() => onClick(note)}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col cursor-pointer group relative"
        >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleEdit}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Редактировать"
                >
                    ✏️
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Удалить"
                >
                   🗑️ 
                </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-16 line-clamp-1">
                {note.title}
            </h3>

            <p className="text-gray-600 mb-4 flex-grow whitespace-pre-wrap line-clamp-3">
                {note.content}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    )
}