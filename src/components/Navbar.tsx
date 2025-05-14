
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";

interface NavbarProps {
  onSearch?: (q: string) => void;
  onCoursesClick?: () => void;
  onHomeClick?: () => void;
}

const Navbar = ({ onSearch, onCoursesClick, onHomeClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
      setIsMenuOpen(false);
    }
  };

  // Helper for Home navigation: full reload if not "/"
  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
    if (onHomeClick) onHomeClick();
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 py-4 px-6 md:px-10 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={handleHomeClick} className="flex items-center gap-2 focus:outline-none">
          <Logo/>
          <span className="font-quicksand font-bold text-xl text-primary">
            Little Genius
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-gray-700 hover:text-primary font-medium" onClick={handleHomeClick}>
            Home
          </button>
          <button
            className="text-gray-700 hover:text-primary font-medium"
            onClick={onCoursesClick}
          >
            Courses
          </button>
          <Link
            to="/about"
            className="text-gray-700 hover:text-primary font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Desktop login button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="font-medium"
                onClick={() => navigate("/admin/dashboard")}
              >
                <User size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="font-medium"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="font-medium"
              onClick={handleLoginClick}
            >
              <User size={18} className="mr-2" />
              Log In
            </Button>
          )}
        </div>

        {/* Mobile menu button & search */}
        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() => setIsMenuOpen((prev) => (prev ? false : true))}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu and search */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-6 bg-white shadow-md mt-2 rounded-md absolute left-0 right-0 z-50">
          <div className="flex flex-col gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex rounded-md overflow-hidden mb-2"
            >
              <input
                type="text"
                className="w-full border rounded-l-md px-3 py-2 outline-none text-base"
                placeholder="Search for courses…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                type="submit"
                className="rounded-l-none"
                variant="secondary"
                aria-label="Search"
              >
                <span className="sr-only">Search</span>
              </Button>
            </form>
            <button
              className="text-gray-700 hover:text-primary font-medium py-2 text-left"
              onClick={() => {
                setIsMenuOpen(false);
                handleHomeClick();
              }}
            >
              Home
            </button>
            <button
              className="text-gray-700 hover:text-primary font-medium py-2 text-left"
              onClick={() => {
                setIsMenuOpen(false);
                if (onCoursesClick) onCoursesClick();
              }}
            >
              Courses
            </button>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex py-2">
              {isAuthenticated ? (
                <div className="w-full space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full font-medium"
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full font-medium"
                    onClick={() => {
                      handleLogoutClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full font-medium"
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
