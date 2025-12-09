import { Link } from "react-router-dom";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import { useAuth } from "../context/AuthContext";

const NoteCard = ({ note, setNotes }) => { 
  const { user } = useAuth(); 

  const isOwner = user && note.user && user._id === note.user._id;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the movie list "${note.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/notes/${note._id}`); 
      
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== note._id));
      toast.success("Movie list deleted successfully!");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete list. You may not have permission.";
      toast.error(errorMessage);
    }
  };

  const postDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const isUpdated = note.updatedAt && (new Date(note.createdAt).getTime() !== new Date(note.updatedAt).getTime());

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-primary/20 hover:border-primary/50 transition-all duration-200">
      
      <Link to={`/list/${note._id}`} className="card-body p-6">
        <h2 className="card-title text-primary text-xl truncate mb-2">{note.title}</h2>
        
        <p className="text-sm text-base-content/60 font-medium">
          Author: <span className="text-base-content font-bold">{note.user?.username || 'Unknown'}</span>
        </p>
        <p className="text-sm text-base-content/60 mb-3">
          Posted: <span className="text-base-content/80">{postDate}</span>
          {isUpdated && <span className="text-base-content/50 ml-2">(Updated)</span>}
        </p>
        
        <div className="text-base-content text-md whitespace-pre-line">
          
          <ol className="list-decimal list-inside mb-4">
            {note.movies && note.movies.slice(0, 3).map((movie, index) => (
              <li key={index} className="text-base-content font-semibold">{movie}</li>
            ))}
            {note.movies.length > 3 && (
                <li className="text-base-content/50">...and {note.movies.length - 3} more.</li>
            )}
          </ol>

          {note.content && (
            <p className="text-sm italic text-base-content/70">
              Notes: {note.content}
            </p>
          )}

        </div>
      </Link>
      
      {isOwner && (
        <div className="card-actions justify-end p-4 border-t border-base-content/10">
          <Link to={`/list/${note._id}/edit`} className="btn btn-sm btn-outline btn-info">
            <Edit2Icon className="size-4" />
          </Link>
          
          <button onClick={handleDelete} className="btn btn-sm btn-outline btn-error">
            <Trash2Icon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;