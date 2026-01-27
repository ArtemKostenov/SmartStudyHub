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
    <div style={{ padding: '20px' }}>
      <h1>Мои заметки</h1>
      <div style={{ display: 'grid', gap: '10px' }}>
        {notes.map((note) => (
          <div key={note.id} style= {{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App