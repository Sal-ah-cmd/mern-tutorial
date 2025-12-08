import { Link } from "react-router-dom"; 
import { PlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx"; 

const Navbar = () => {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-primary font-mono tracking-tight">
            ThinkBoard
          </Link>
          <div className="flex items-center gap-4">
            {/* New Note Link (Only visible to logged-in users later, but keeping here for now) */}
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>

            {/* AUTHENTICATION STATUS (Translation of header.php logic) */}
            <div className="text-sm text-base-content/70">
              {user ? (
                <>
                  Logged in as: <b>{user.username}</b> | 
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-500 ml-1">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  Logged in as: <b>Guest</b> | 
                  <Link to="/login" className="text-red-400 hover:text-red-500 ml-1">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;