import React, { useEffect, useState } from 'react';
import type { MissingPerson, Comment } from '../types';
import { addCommentForPerson, getCommentsForPerson } from '../services/dataService';

interface PersonDetailModalProps {
  person: MissingPerson | null;
  onClose: () => void;
}

const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ person, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (person) {
        const list = await getCommentsForPerson(person.id);
        setComments(list);
      }
    };
    load();
  }, [person]);

  if (!person) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;
    await addCommentForPerson(person.id, authorName.trim(), message.trim());
    setAuthorName('');
    setMessage('');
    const list = await getCommentsForPerson(person.id);
    setComments(list);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">{person.fullName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="aspect-[4/3] bg-gray-100">
            {person.photoURL ? (
              <img src={person.photoURL} alt={person.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <div className="text-sm text-gray-600">Missing since: <span className="font-medium text-gray-800">{person.missingDate}</span></div>
            <div className="text-sm text-gray-600">Last seen: <span className="font-medium text-gray-800">{person.lastSeenLocation}</span></div>
            {person.contactPhone && (
              <div className="text-sm text-gray-600">Contact: <a className="text-blue-600 hover:underline" href={`tel:${person.contactPhone}`}>{person.contactPhone}</a></div>
            )}
            {person.features && (
              <div className="text-sm text-gray-600">Features: <span className="text-gray-800">{person.features}</span></div>
            )}
            <div className="text-sm text-gray-600">Description:</div>
            <p className="text-sm text-gray-800 whitespace-pre-line">{person.description}</p>
          </div>
        </div>

        <div className="p-4 border-t">
          <h4 className="font-semibold mb-2">Comments</h4>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 mb-3">No comments yet. Be the first to share information.</p>
          ) : (
            <ul className="space-y-3 mb-4 max-h-48 overflow-auto pr-1">
              {comments.map((c) => (
                <li key={c.id} className="text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="font-medium text-gray-700">{c.authorName}</span>
                    <span>·</span>
                    <span>{c.createdAt.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800">{c.message}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Add a helpful comment (location, time, details)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm md:col-span-2"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailModal; 