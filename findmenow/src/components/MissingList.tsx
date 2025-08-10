import React, { useMemo } from 'react';
import type { MissingPerson } from '../types';
import { likeReport, unlikeReport } from '../firebaseService';

interface MissingListProps {
  missingPersons: MissingPerson[];
  searchQuery: string;
  onSelect?: (person: MissingPerson) => void;
}

function getClientId(): string {
  const KEY = 'fm_client_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

const MissingList: React.FC<MissingListProps> = ({ missingPersons, searchQuery, onSelect }) => {
  const userId = useMemo(() => getClientId(), []);

  const filteredPersons = missingPersons.filter(person => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      person.fullName.toLowerCase().includes(query) ||
      person.lastSeenLocation.toLowerCase().includes(query) ||
      person.description.toLowerCase().includes(query) ||
      (person.features || '').toLowerCase().includes(query)
    );
  });

  const handleShare = async (person: MissingPerson) => {
    const text = `Missing: ${person.fullName}\nLast seen: ${person.lastSeenLocation}\nDate: ${person.missingDate}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FindMeNow', text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert('Copied details to clipboard!');
      }
    } catch (_) {}
  };

  const toggleLike = async (person: MissingPerson) => {
    const likes = (person as any).likes as string[] | undefined;
    const hasLiked = Array.isArray(likes) && likes.includes(userId);
    try {
      if (hasLiked) {
        await unlikeReport(person.id, userId);
      } else {
        await likeReport(person.id, userId);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update like');
    }
  };

  if (filteredPersons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {searchQuery ? 'No matching missing person reports found.' : 'No missing person reports yet.'}
        </div>
        <div className="text-gray-400 text-sm mt-2">
          {searchQuery ? 'Try adjusting your search terms.' : 'Be the first to report a missing person.'}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPersons.map((person) => {
        const likes = (person as any).likes as string[] | undefined;
        const count = Array.isArray(likes) ? likes.length : 0;
        const hasLiked = Array.isArray(likes) ? likes.includes(userId) : false;
        return (
          <div key={person.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-[16/9] bg-gray-200 w-full">
              {person.photoURL ? (
                <img
                  src={person.photoURL}
                  alt={person.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTEwQzExMS4wNDYgMTEwIDEyMCAxMDEuMDQ2IDEyMCA5MEMxMjAgNzguOTU0IDExMS4wNDYgNzAgMTAwIDcwQzg4Ljk1NCA3MCA4MCA3OC45NTQgODAgOTBDODAgMTAxLjA0NiA4OC45NTQgMTEwIDEwMCAxMTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzEzMy4xMzcgMTMwIDE2MCAxMTMuMTM3IDE2MCA4MEMxNjAgNDYuODYzIDEzMy4xMzcgMzAgMTAwIDMwQzY2Ljg2MyAzMCA0MCA0Ni44NjMgNDAgODBDNDAgMTEzLjEzNyA2Ni44NjMgMTMwIDEwMCAxMzBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{person.fullName}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${person.status === 'missing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {person.status === 'missing' ? 'Missing' : 'Found'}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Missing since:</span> {person.missingDate}
              </div>

              <div className="mb-2">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{person.lastSeenLocation}</span>
                </div>
              </div>

              {person.features && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">{person.features}</p>
              )}

              <p className="text-sm text-gray-600 line-clamp-3">{person.description}</p>

              <div className="mt-3 text-xs text-gray-400">Reported: {person.createdAt.toLocaleDateString()}</div>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => onSelect?.(person)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Details</button>
                <button onClick={() => handleShare(person)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Share</button>
                <button onClick={() => toggleLike(person)} className={`ml-auto px-3 py-1 text-sm rounded ${hasLiked ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-700 border'}`}>
                  {hasLiked ? 'Unlike' : 'Like'} · {count}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MissingList; 