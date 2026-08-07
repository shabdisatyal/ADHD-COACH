// frontend/components/pages/subjects.jsx
import { useState, useEffect } from 'react';
import { TodoModal } from '../TodoModal';

const API = 'http://localhost:8000/api'; // adjust to your backend URL

export function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [activeSubject, setActiveSubject] = useState(null); // { id, name } or null

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    const res = await fetch(`${API}/subjects`);
    const data = await res.json();
    setSubjects(data);
  }

  async function handleAdd() {
    if (!newSubject.trim()) return;
    const res = await fetch(`${API}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSubject.trim() }),
    });
    if (res.ok) {
      setNewSubject('');
      fetchSubjects();
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation(); // don't trigger the modal open
    await fetch(`${API}/subjects/${id}`, { method: 'DELETE' });
    fetchSubjects();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-fascinate mb-4">Subjects</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a subject..."
          className="flex-1 border border-[#90AB8B] rounded-sm px-3 py-2"
        />
        <button
          onClick={handleAdd}
          className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm hover:bg-[#5A7863]"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {subjects.map((s) => (
          <div
            key={s.id}
            onClick={() => setActiveSubject(s)}
            className="flex justify-between items-center bg-[#90AB8B] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#7f9c79] transition-colors"
          >
            <span className="text-white font-medium">{s.name}</span>
            <button
              onClick={(e) => handleDelete(s.id, e)}
              className="text-white hover:text-red-200 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        {subjects.length === 0 && (
          <p className="text-gray-500 text-sm">No subjects yet — add one above.</p>
        )}
      </div>

      {activeSubject && (
        <TodoModal
          subject={activeSubject}
          onClose={() => setActiveSubject(null)}
        />
      )}
    </div>
  );
}