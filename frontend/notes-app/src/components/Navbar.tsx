import React, { useState } from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./SearchBar/SearchBar";
import { useNavigate } from "react-router-dom"; 

interface NavbarProps {
  userInfo: any; // Replace 'any' with the appropriate type for userInfo
  onSearchNote: (query: string) => void; // Add the onSearchNote property
  handleClearSearch: () => void; // Add the handleClearSearch property
}

const Navbar: React.FC<NavbarProps> = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); 

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onSearchNote(searchQuery); 
    } else {
      onSearchNote(""); 
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

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow shadow-md">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} /> {/* No props needed here */}
    </div>
  );
};

export default Navbar;
