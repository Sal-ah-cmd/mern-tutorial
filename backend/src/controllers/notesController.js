import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";

const processMoviesInput = (moviesString) => {
  return moviesString
    .split('\n')
    .map(movie => movie.trim())
    .filter(movie => movie.length > 0);
};

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({}).populate('user', 'username').sort({ createdAt: -1 });
  res.status(200).json(notes);
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('user', 'username');
  if (!note) {
    res.status(404);
    throw new Error("Movie list not found!");
  }
  res.json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, movies: moviesString, content } = req.body;
  const movies = processMoviesInput(moviesString || '');

  if (!title || movies.length === 0) {
    res.status(400);
    throw new Error("Please add a list title and at least one movie.");
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    movies,
    content,
  });

  if (note) {
    const populatedNote = await Note.findById(note._id).populate('user', 'username');
    res.status(201).json(populatedNote);
  } else {
    res.status(400);
    throw new Error("Invalid list data received.");
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, movies: moviesString, content } = req.body;
  const note = await Note.findById(req.params.id);
  const movies = processMoviesInput(moviesString || '');

  if (!note) {
    res.status(404);
    throw new Error("Movie list not found");
  }
  
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this movie list (Must be the owner).");
  }

  if (movies.length === 0) {
    res.status(400);
    throw new Error("The movie list cannot be empty.");
  }

  note.title = title || note.title;
  note.movies = movies;
  note.content = content;

  const updatedNote = await note.save();

  const populatedUpdatedNote = await Note.findById(updatedNote._id).populate('user', 'username');
  res.json(populatedUpdatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("list not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this list (Must be the owner).");
  }

  await Note.deleteOne({ _id: req.params.id });

  res.json({ message: "List removed" });
});

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };