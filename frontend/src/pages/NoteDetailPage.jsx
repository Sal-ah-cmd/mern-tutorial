import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [moviesString, setMoviesString] = useState("");
  const [content, setContent] = useState("");
  const [fetchedNote, setFetchedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = fetchedNote && user && fetchedNote.user?._id === user._id;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const note = res.data;
        
        setFetchedNote(note);
        setTitle(note.title);
        setContent(note.content || '');
        setMoviesString(note.movies.join('\n'));

      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch the movie list.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!isOwner) {
        toast.error("You are not authorized.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete the movie list "${fetchedNote.title}"?`)) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Movie list deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete movie list");
    }
  };

  const handleSave = async () => {
    if (!isOwner) {
        toast.error("You are not authorized.");
        return;
    }
    if (!title.trim() || !moviesString.trim()) {
      toast.error("Both fields cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title,
        movies: moviesString,
        content,
      });
      toast.success("Movie list updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update movie list");
    } finally {
      setSaving(false);
    }
  };

  const renderViewMode = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-4 text-primary">{fetchedNote.title}</h2>
        <div className="text-sm text-base-content/60 mb-4">
          Author: <span className="font-bold">{fetchedNote.user.username}</span> |
          Posted: {new Date(fetchedNote.createdAt).toLocaleDateString()}
        </div>

        <h3 className="text-lg font-semibold mb-2">Movies List:</h3>
        <ol className="list-decimal list-inside text-base-content mb-6 p-4 bg-base-200 rounded-lg">
          {fetchedNote.movies.map((movie, index) => (
            <li key={index} className="py-1">{movie}</li>
          ))}
        </ol>
        
        {fetchedNote.content && (
          <>
            <h3 className="text-lg font-semibold mb-2">Content:</h3>
            <p className="whitespace-pre-wrap text-base-content/80 p-4 bg-base-200 rounded-lg">{fetchedNote.content}</p>
          </>
        )}
      </div>
    </div>
  );


  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center mt-20 p-8 bg-error/10 border border-error text-error rounded-lg max-w-lg mx-auto shadow-xl">
            <h1 className="text-xl font-bold mb-4">Error</h1>
            <p className="text-lg">{error}</p>
            <Link to="/" className="mt-4 btn btn-primary btn-sm">
                <ArrowLeftIcon className="size-4" /> Go Home
            </Link>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Lists
            </Link>
            {isOwner && (
              <button onClick={handleDelete} className="btn btn-error btn-outline">
                <Trash2Icon className="h-5 w-5" />
                Delete List
              </button>
            )}
          </div>
          
          {isOwner ? (
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Edit Movie List</h2>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Movies List</span>
                  </label>
                  <textarea
                    placeholder="1. Movie Title A&#10;2. Movie Title B&#10;3. Movie Title C"
                    className="textarea textarea-bordered h-32"
                    value={moviesString}
                    onChange={(e) => setMoviesString(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="..."
                    className="textarea textarea-bordered h-20"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            renderViewMode()
          )}
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;