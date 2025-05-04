import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar: React.FC<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}> = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <button
          aria-label="Clear"
          className="text-xl text-slate-500 cursor-pointer hover:text-black"
          onClick={onClearSearch}
        >
          <IoMdClose />
        </button>
      )}
      <button
        aria-label="Search"
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  );
};

export default SearchBar;
