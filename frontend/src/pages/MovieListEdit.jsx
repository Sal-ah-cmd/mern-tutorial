import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, PlusCircleIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const MovieListEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([""]);
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
        
        if (user && note.user?._id !== user._id) {
            toast.error("You are not authorized to edit this list.");
            navigate(`/list/${id}`);
            return;
        }

        setFetchedNote(note);
        setTitle(note.title);
        setContent(note.content || '');
        setMovies(note.movies.length > 0 ? note.movies : [""]);

      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch the movie list.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, user, navigate]);

  const handleMovieChange = (index, value) => {
    const newMovies = [...movies];
    newMovies[index] = value;
    setMovies(newMovies);
  };

  const handleAddMovie = () => {
    setMovies([...movies, ""]);
  };

  const handleRemoveMovie = (index) => {
    const newMovies = movies.filter((_, i) => i !== index);
    setMovies(newMovies.length > 0 ? newMovies : [""]); 
  };

  const handleDelete = async () => {
    if (!isOwner) {
        toast.error("You are not authorized to delete this list.");
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
        toast.error("You are not authorized to update this list.");
        return;
    }
    
    const validMovies = movies.map(movie => movie.trim()).filter(movie => movie.length > 0);

    if (!title.trim() || validMovies.length === 0) {
      toast.error("List Title and Movies List cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title,
        movies: validMovies.join('\n'), 
        content,
      });
      toast.success("Movie list updated successfully");
      navigate(`/list/${id}`); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update movie list");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (error || !fetchedNote) {
    return (
        <div className="text-center mt-20 p-8 bg-error/10 border border-error text-error rounded-lg max-w-lg mx-auto shadow-xl">
            <h1 className="text-xl font-bold mb-4">Error</h1>
            <p className="text-lg">{error || "List not found or access denied."}</p>
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
            <Link to={`/list/${id}`} className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to View
            </Link>
            {isOwner && (
              <button onClick={handleDelete} className="btn btn-error btn-outline">
                <Trash2Icon className="h-5 w-5" />
                Delete
              </button>
            )}
          </div>
          
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
              
              <div className="form-control mb-4 p-4 border border-base-content/20 rounded-lg">
                <label className="label">
                  <span className="label-text text-lg font-bold">Movies List</span>
                </label>
                
                {movies.map((movie, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="font-semibold w-6 text-right text-base-content/80">{index + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Movie entry ${index + 1}`}
                      className="input input-bordered input-sm flex-grow"
                      value={movie}
                      onChange={(e) => handleMovieChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-error btn-sm btn-square"
                      onClick={() => handleRemoveMovie(index)}
                      disabled={movies.length === 1}
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                ))}
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="btn btn-success btn-sm btn-outline"
                    onClick={handleAddMovie}
                  >
                    <PlusCircleIcon className="size-4" /> Add Movie Entry
                  </button>
                </div>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  placeholder="Add notes about movies."
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
        </div>
      </div>
    </div>
  );
};
export default MovieListEdit;