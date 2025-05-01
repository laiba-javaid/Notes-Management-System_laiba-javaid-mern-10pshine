import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  userInfo: { fullName: string }; 
  onSearchNote: (query: string) => void;
  handleClearSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearchNote(searchQuery.trim());
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

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
