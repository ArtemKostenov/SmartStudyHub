import { useEffect, useState } from "react";
import type { Note } from './types/note';
import { notesApi } from "./api/notesApi";
import { CreateNoteModal } from "./components/CreateNoteModal";
import { useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage.tsx";
import { KanbanBoard } from "./components/KanbanBoard.tsx";

function App() {
  const { isAuthenticated, logout, user } = useAuth()

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated && activeTab === 'notes') {
      setLoading(true);
      fetchNotes().finally(() => setLoading(false));
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7x1 mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2x1 font-bold text-indigo-600">Smart Study Hub</h1>

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
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
              >
                <span>+</span> <span className="hidden sm:inline">Заметка</span>
              </button>
            )}

            {activeTab === 'tasks' && (
              <button
                onClick={() => alert('Пока зашлушка')}
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
      <main className="max-w-7x1 mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full">
        {activeTab === 'notes' && (
          loading ? (
            <div className="text-center py-10">
              <p className="text-lg animate-pulse text-gray-500">Загрузка заметок...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-x1 font-semibold text-gray-900 line-clamp-1">
                      {note.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {note.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>  
              ))}
            </div>
          )
        )}

        {activeTab === 'notes' && !loading && notes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Пока не создано ни одной заметки! Создайте свою первую заметку и присоединяйтесь к нам!!!</p>
          </div>
        )}

        {activeTab === "tasks" && <KanbanBoard />}
      </main>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoteCreated={() => {
          fetchNotes();
        }}
      />
    </div>
  )
}

export default App