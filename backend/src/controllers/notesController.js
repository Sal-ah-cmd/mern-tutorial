import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({}).populate('user', 'username').sort({ createdAt: -1 });
  res.status(200).json(notes);
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('user', 'username');
  if (!note) {
    res.status(404);
    throw new Error("Note not found!");
  }
  res.json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Please add a title and content for the movie list.");
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
  });

  if (note) {
    const populatedNote = await Note.findById(note._id).populate('user', 'username');
    res.status(201).json(populatedNote);
  } else {
    res.status(400);
    throw new Error("Invalid note data received.");
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this note (Must be the owner).");
  }

  note.title = title || note.title;
  note.content = content || note.content;

  const updatedNote = await note.save();

  const populatedUpdatedNote = await Note.findById(updatedNote._id).populate('user', 'username');
  res.json(populatedUpdatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this note (Must be the owner).");
  }

  await Note.deleteOne({ _id: req.params.id });

  res.json({ message: "Note removed" });
});

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };