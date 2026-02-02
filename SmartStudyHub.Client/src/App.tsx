import { useEffect, useState } from "react";
import type { Note } from './types/note';
import { notesApi } from "./api/notesApi";
import { NoteModal } from "./components/NoteModal.tsx";
import { useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage.tsx";
import { KanbanBoard } from "./components/KanbanBoard.tsx";
import { CreateTaskModal } from "./components/CreateTaskModal.tsx";
import { NoteCard } from "./components/NoteCard.tsx";

function App() {
  const { isAuthenticated, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');

  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

  const fetchNotes = async () => {
    try {
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpen = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditOpen = (note: Note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      alert('Ошибка при удалении');
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'notes') {
      setLoading(true);
      fetchNotes().finally(() => setLoading(false));
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Study Hub</h1>

            <nav className="hidden md:flex gap-4">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-2 rounded-md transition ${activeTab === 'notes' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Заметки
              </button>
              <button 
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-2 rounded-md transition ${activeTab === 'tasks' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Задачи
              </button>
            </nav>
          </div>

          <div className="flex gap-3">
            {activeTab === 'notes' && (
              <button 
                onClick={handleCreateOpen}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
              >
                <span>+</span> <span className="hidden sm:inline">Заметка</span>
              </button>
            )}

            {activeTab === 'tasks' && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
              >
                <span>+</span><span className="hidden sm:inline">Задача</span>
              </button>
            )}

            <button
              onClick={logout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full">
        {activeTab === 'notes' && (
          loading ? (
            <div className="text-center py-10">
              <p className="text-lg animate-pulse text-gray-500">Загрузка заметок...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={handleEditOpen}
                  onEdit={handleEditOpen}
                  onDelete={handleDeleteNote}
                /> 
              ))}
            </div>
          )
        )}

        {activeTab === 'notes' && !loading && notes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Пока не создано ни одной заметки! Создайте свою первую заметку и присоединяйтесь к нам!!!</p>
          </div>
        )}

        {activeTab === "tasks" && <KanbanBoard key={tasksRefreshKey}/>}
      </main>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSaved={fetchNotes}
        noteToEdit={editingNote}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={() => setTasksRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}

export default App