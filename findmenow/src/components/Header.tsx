import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { signInWithGoogle, signOutUser } from '../firebaseService';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (e) {
      console.error(e);
      alert('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-brand">FindMeNow</span>
          <span className="hidden sm:inline text-xs text-gray-500">Missing Persons Finder</span>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-3 py-1.5 rounded bg-brand text-white text-sm hover:opacity-95"
            >
              {loading ? 'Signing in…' : 'Login with Google'}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-sm text-gray-700">Hello, {user.displayName || 'User'}</div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-3 py-1.5 rounded bg-gray-100 text-gray-800 text-sm hover:bg-gray-200"
              >
                {loading ? '…' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 