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
            MovieBoard
          </Link>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New List</span>
            </Link>

            <div className="text-sm text-base-content/70">
              {user ? (
                <>
                  Logged in as: <b>{user.username}</b> | 
                  <button onClick={handleLogout} className="text-primary hover:text-primary-focus ml-1">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  Logged in as: <b>Guest</b> | 
                  <Link to="/login" className="text-primary hover:text-primary-focus mr-2">
                    Login
                  </Link>
                  | 
                  <Link to="/signup" className="text-primary hover:text-primary-focus ml-2">
                    Signup
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