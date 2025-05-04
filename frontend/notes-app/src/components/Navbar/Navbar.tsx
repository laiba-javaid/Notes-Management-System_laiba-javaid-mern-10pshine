import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RiSearchLine, RiSearchEyeLine, RiCloseLine } from "react-icons/ri";
import { BsJournalBookmark } from "react-icons/bs";
import { getInitials } from "../../utils/helper";

interface NavbarProps {
  userInfo: { fullName: string } | null;
  onSearchNote: (query: string) => void;
  handleClearSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery.trim());
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Animation variants
  const searchVariants = {
    focused: { 
      width: "400px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
    },
    default: { 
      width: "280px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
    }
  };

  const dropdownVariants = {
    open: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    closed: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="bg-white px-6 py-3 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <BsJournalBookmark className="text-indigo-600 text-2xl mr-2" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">NoteKeeper</h2>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className={`bg-white flex items-center rounded-full border px-4 py-2 ${isSearchFocused ? 'border-indigo-400' : 'border-gray-200'}`}
          variants={searchVariants}
          animate={isSearchFocused ? "focused" : "default"}
          initial="default"
        >
          {searchQuery ? (
            <RiSearchEyeLine className="text-indigo-500 text-xl mr-2" />
          ) : (
            <RiSearchLine className={`text-xl mr-2 ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
          )}
          
          <input
            type="text"
            className="w-full outline-none text-sm"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearSearch}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <RiCloseLine className="text-lg" />
            </motion.button>
          )}
        </motion.div>

        {/* Profile Section */}
        <div className="relative">
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium mr-3"
              whileHover={{ boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.3)" }}
            >
              {userInfo ? getInitials(userInfo.fullName) : "?"}
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {userInfo ? userInfo.fullName : "Guest"}
              </p>
            </div>
          </motion.div>

          {/* Dropdown menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                variants={dropdownVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="p-2">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Add missing AnimatePresence import
import { AnimatePresence } from "framer-motion";

export default Navbar;