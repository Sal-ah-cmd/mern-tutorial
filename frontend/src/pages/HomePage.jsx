import { useState, useEffect } from "react";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { useAuth } from "../context/AuthContext"; 

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isLoggedIn, authToken } = useAuth(); 

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        setNotes([]);
        return; 
      }
      
      setLoading(true);
      try {
        const res = await api.get("/notes", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          if (isLoggedIn) {
             toast.error("Failed to load notes");
          }
        }
        setNotes([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [isLoggedIn, authToken]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20 p-8 bg-base-200/50 rounded-lg max-w-lg mx-auto shadow-xl">
        <h1 className="text-3xl font-bold text-primary mb-4"> Login Required</h1>
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
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !loading && !isRateLimited && <NotesNotFound />} 

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