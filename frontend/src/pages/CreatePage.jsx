import { ArrowLeftIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([""]); 
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    setMovies(newMovies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMovies = movies.map(movie => movie.trim()).filter(movie => movie.length > 0);

    if (!title.trim() || validMovies.length === 0) {
      toast.error("Both field cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        movies: validMovies.join('\n'),
        content,
      });

      toast.success("Movie List created successfully!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating lists too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create List");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Lists
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New List</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Top 10 Favorite Movies"
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
                        placeholder={`Movie ${index + 1}`}
                        className="input input-bordered input-sm flex-grow"
                        value={movie}
                        onChange={(e) => handleMovieChange(index, e.target.value)}
                      />
                      {movies.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-error btn-sm btn-square"
                          onClick={() => handleRemoveMovie(index)}
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      )}
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
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create List"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;