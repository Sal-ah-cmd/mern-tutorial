import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const { isLoggedIn, authToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isLoggedIn) {
        setNotes([]);
        setNotesLoading(false);
        return; 
      }
      
      setNotesLoading(true);

      try {
        const res = await api.get("/notes", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          if (error.response?.status !== 401) { 
             toast.error("Failed to load notes");
          }
        }
        setNotes([]);
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [isLoggedIn, authToken, location.pathname]); 

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20 p-8 bg-base-200/50 rounded-lg max-w-lg mx-auto shadow-xl">
        <h1 className="text-3xl font-bold text-primary mb-4">🔐 Login Required</h1>
        <p className="text-lg text-base-content/80">
          Please **log in** to view and manage your private notes.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {notesLoading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !notesLoading && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;