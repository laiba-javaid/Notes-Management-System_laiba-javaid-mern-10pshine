const Note = require('../models/note.model');

async function addNote({ userId, title, content, tags = [] }) {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const note = await Note.create({ title, content, tags, userId });
  return note;
}

async function editNote({ userId, noteId, title, content, tags, isPinned }) {
  if (!title && !content && !tags && isPinned === undefined) {
    throw new Error('At least one field must be provided');
  }

  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new Error('Note not found or unauthorized');

  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags;
  if (isPinned !== undefined) note.isPinned = isPinned;

  await note.save();
  return note;
}

async function getAllNotes(userId) {
  return await Note.find({ userId }).sort({ isPinned: -1 });
}

async function deleteNote({ userId, noteId }) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new Error('Note not found');

  await Note.deleteOne({ _id: noteId, userId });
  return true;
}

async function updatePinnedStatus({ userId, noteId, isPinned }) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new Error('Note not found');

  note.isPinned = !!isPinned;
  await note.save();
  return note;
}

async function searchNotes({ userId, query }) {
  if (!query) throw new Error('Search query is required');

  return await Note.find({
    userId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ],
  });
}

module.exports = {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updatePinnedStatus,
  searchNotes,
};
