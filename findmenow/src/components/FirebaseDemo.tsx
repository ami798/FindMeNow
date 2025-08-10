import React, { useEffect, useState } from 'react';
import { addMissingPerson, getMissingPersons, PersonData, MissingPersonDoc } from '../firebaseService';

const initialData: PersonData = {
  name: '',
  age: 0,
  lastSeenLocation: '',
  dateMissing: new Date().toISOString().slice(0, 10),
  description: '',
};

const FirebaseDemo: React.FC = () => {
  const [form, setForm] = useState<PersonData>(initialData);
  const [photo, setPhoto] = useState<File | null>(null);
  const [list, setList] = useState<MissingPersonDoc[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const items = await getMissingPersons();
      setList(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert('Please select a photo');
      return;
    }
    try {
      setLoading(true);
      await addMissingPerson(form, photo);
      setForm(initialData);
      setPhoto(null);
      await load();
      alert('Report submitted');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Firebase Demo Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Age</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Last Seen Location</label>
          <input className="w-full border rounded px-3 py-2" value={form.lastSeenLocation} onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Date Missing</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.dateMissing} onChange={(e) => setForm({ ...form, dateMissing: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" onClick={load} className="px-4 py-2 bg-gray-100 rounded">Refresh</button>
          <button type="submit" disabled={loading} className="px-4 py-2 btn-primary rounded">{loading ? 'Submitting...' : 'Submit'}</button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mt-8 mb-3">Missing Persons</h3>
      {loading && list.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li key={p.id} className="p-3 border rounded flex gap-3 items-center">
              <img src={p.photoURL} alt={p.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <div className="font-medium">{p.name} · {p.age}</div>
                <div className="text-sm text-gray-600">Last seen: {p.lastSeenLocation} · Missing since: {p.dateMissing}</div>
                <div className="text-sm text-gray-600">Reported: {p.reportedAt ? p.reportedAt.toLocaleString() : '—'}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FirebaseDemo; 