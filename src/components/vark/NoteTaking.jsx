import React, { useState } from 'react';
import { FileText, Save, Download, Trash2, Plus } from 'lucide-react';

/**
 * Note Taking Component
 * Comprehensive note-taking tool for read/write learners
 */
const NoteTaking = ({ lessonTitle, onSave }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const saveNote = () => {
    if (!currentNote.trim()) return;

    const note = {
      id: editingId || Date.now(),
      title: noteTitle || 'Untitled Note',
      content: currentNote,
      timestamp: new Date().toISOString(),
      lessonTitle,
    };

    if (editingId) {
      setNotes(prev => prev.map(n => n.id === editingId ? note : n));
    } else {
      setNotes(prev => [...prev, note]);
    }

    resetForm();

    if (onSave) {
      onSave(notes);
    }
  };

  const editNote = (note) => {
    setNoteTitle(note.title);
    setCurrentNote(note.content);
    setEditingId(note.id);
    setIsEditing(true);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const resetForm = () => {
    setCurrentNote('');
    setNoteTitle('');
    setEditingId(null);
    setIsEditing(false);
  };

  const exportNotes = () => {
    const notesText = notes.map(note => 
      `# ${note.title}\n\n${note.content}\n\n---\n\n`
    ).join('');

    const blob = new Blob([notesText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle || 'notes'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-innova-navy-600 dark:text-innova-navy-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Notes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lessonTitle || 'Take notes while you learn'}
              </p>
            </div>
          </div>
          {notes.length > 0 && (
            <button
              onClick={exportNotes}
              className="px-3 py-2 bg-innova-navy-100 hover:bg-innova-navy-200 dark:bg-innova-navy-900/30 dark:hover:bg-innova-navy-800/40 text-innova-navy-700 dark:text-innova-navy-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-3">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full px-4 py-2 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-innova-navy-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Write your notes here... Use markdown for formatting!"
          className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-innova-navy-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-serif"
        />
        <div className="mt-3 flex gap-2 justify-end">
          {isEditing && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={saveNote}
            disabled={!currentNote.trim()}
            className="px-4 py-2 bg-innova-navy-500 hover:bg-innova-navy-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No notes yet. Start writing to capture your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Saved Notes ({notes.length}):
            </h4>
            {notes.map(note => (
              <div
                key={note.id}
                className="p-4 bg-innova-navy-50 dark:bg-innova-navy-900/20 border border-innova-navy-200 dark:border-innova-navy-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </h5>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editNote(note)}
                      className="p-1 hover:bg-innova-navy-200 dark:hover:bg-innova-navy-800 rounded transition-colors"
                      title="Edit note"
                    >
                      <FileText className="w-4 h-4 text-innova-navy-600 dark:text-innova-navy-400" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-3">
                  {note.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Write detailed notes to reinforce your learning • Supports Markdown formatting
        </p>
      </div>
    </div>
  );
};

export default NoteTaking;
