import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import {
  getPendingReports,
  updateReportStatus,
  notifyPolice,
  MissingPersonDoc,
  PoliceStationInfo,
} from '../firebaseService';

const AdminDashboard: React.FC = () => {
  const [pending, setPending] = useState<MissingPersonDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const user = auth.currentUser;

  const [station, setStation] = useState<Record<string, PoliceStationInfo>>({});

  const isLoggedIn = useMemo(() => Boolean(user), [user]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getPendingReports();
      setPending(items);
    } catch (e) {
      console.error(e);
      setError('Failed to load pending reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setSaving(id);
      await updateReportStatus(id, 'approved');
      await load();
    } catch (e) {
      console.error(e);
      alert('Approve failed');
    } finally {
      setSaving(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setSaving(id);
      await updateReportStatus(id, 'rejected');
      await load();
    } catch (e) {
      console.error(e);
      alert('Reject failed');
    } finally {
      setSaving(null);
    }
  };

  const handleNotify = async (id: string) => {
    const s = station[id];
    if (!s || !s.name || !s.phone) {
      alert('Please enter police station name and phone');
      return;
    }
    try {
      setSaving(id);
      await notifyPolice(id, s);
      await load();
      alert('Police notified');
    } catch (e) {
      console.error(e);
      alert('Failed to notify police');
    } finally {
      setSaving(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow-sm p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Please sign in to view and manage pending reports.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading pending reports…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
        <button onClick={load} className="mt-3 text-red-700 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Reports</h2>
      {pending.length === 0 ? (
        <div className="text-gray-600">No pending reports.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.map((r) => (
            <li key={r.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
              <img src={r.photoURL} alt={r.name} className="w-full h-44 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold truncate">{r.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{r.status}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">Age: {r.age}</div>
                <div className="text-sm text-gray-600">Last seen: {r.lastSeenLocation}</div>
                <div className="text-sm text-gray-600">Missing since: {r.dateMissing}</div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{r.description}</p>
                <div className="mt-2 text-xs text-gray-500">Reported: {r.reportedAt ? r.reportedAt.toLocaleString() : '—'}</div>

                {/* Police form */}
                <div className="mt-3 space-y-2 bg-gray-50 rounded-md p-3">
                  <div className="text-sm font-medium text-gray-800">Police Station</div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={station[r.id]?.name || ''}
                    onChange={(e) => setStation((s) => ({ ...s, [r.id]: { ...(s[r.id] || { name: '', phone: '', address: '' }), name: e.target.value } }))}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={station[r.id]?.phone || ''}
                    onChange={(e) => setStation((s) => ({ ...s, [r.id]: { ...(s[r.id] || { name: '', phone: '', address: '' }), phone: e.target.value } }))}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={station[r.id]?.address || ''}
                    onChange={(e) => setStation((s) => ({ ...s, [r.id]: { ...(s[r.id] || { name: '', phone: '', address: '' }), address: e.target.value } }))}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={saving === r.id}
                    className="px-2 py-2 text-xs md:text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    disabled={saving === r.id}
                    className="px-2 py-2 text-xs md:text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleNotify(r.id)}
                    disabled={saving === r.id}
                    className="px-2 py-2 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Notify Police
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard; 