import { useEffect, useState } from "react";
import type { Note } from './types/note';
import { notesApi } from "./api/notesApi";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await notesApi.getAll();
        setNotes(data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7x1 mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2x1 font-bold text-indigo-600">Smart Study Hub</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            + Создать
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7x1 mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">Загрузка заметок...</p>
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
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    ID: {note.id}
                  </span>
                </div>
              </div>  
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Пока не создано ни одной заметки! Создайте свою первую заметку и присоединяйтесь к нам!!!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App