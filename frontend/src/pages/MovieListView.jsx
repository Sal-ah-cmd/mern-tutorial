import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Edit2Icon, LoaderIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const MovieListView = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [fetchedNote, setFetchedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setFetchedNote(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch the movie list.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
        <div className="text-center p-8 bg-error/10 border border-error text-error rounded-lg max-w-lg shadow-xl">
          <h1 className="text-xl font-bold mb-4">Access Error</h1>
          <p className="text-lg">{error}</p>
          <Link to="/" className="mt-6 btn btn-primary btn-sm">
            <ArrowLeftIcon className="size-4" /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && fetchedNote.user && fetchedNote.user._id === user._id;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Lists
            </Link>
            {isOwner && (
              <Link to={`/list/${fetchedNote._id}/edit`} className="btn btn-info btn-outline">
                <Edit2Icon className="h-5 w-5" />
                Edit List
              </Link>
            )}
          </div>

          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body p-8">
              <h2 className="card-title text-4xl mb-2 text-primary">{fetchedNote.title}</h2>
              <div className="text-sm text-base-content/60 mb-6 border-b border-base-content/10 pb-3">
                Author: <span className="font-bold text-base-content">{fetchedNote.user.username}</span> |
                Posted: {new Date(fetchedNote.createdAt).toLocaleDateString()}
              </div>

              <h3 className="text-xl font-bold mb-3 text-base-content">Movies List:</h3>
              <ol className="list-decimal list-inside text-base-content mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
                {fetchedNote.movies.map((movie, index) => (
                  <li key={index} className="py-1 text-lg font-medium">{movie}</li>
                ))}
              </ol>

              {fetchedNote.content && (
                <>
                  <h3 className="text-xl font-bold mb-3 text-base-content">Notes:</h3>
                  <p className="whitespace-pre-wrap text-base-content/80 p-6 bg-base-200 rounded-lg shadow-inner italic">{fetchedNote.content}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieListView;