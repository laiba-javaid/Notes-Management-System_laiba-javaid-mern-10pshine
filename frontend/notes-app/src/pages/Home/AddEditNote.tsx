import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TagsInput from "../../components/Inputs/TagsInput";
import { MdClose, MdTitle, MdNotes, MdLocalOffer } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

interface AddEditNoteProps {
  noteData?: { _id?: string; title: string; content: string; tags: string[] } | null;
  type?: string;
  onClose: () => void;
  getAllNotes: () => void;
  showToastMessage: (message: string, type: "success" | "delete" | "error") => void;
}

const AddEditNote = ({ noteData, type, getAllNotes, onClose, showToastMessage }: AddEditNoteProps) => {
  const [title, setTitle] = useState<string>(noteData?.title || "");
  const [content, setContent] = useState<string>(noteData?.content || "");
  const [tags, setTags] = useState<string[]>(noteData?.tags || []);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      } 
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0px 6px 15px rgba(59, 130, 246, 0.4)",
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      } 
    },
    tap: { 
      scale: 0.97
    }
  };

  // Populate fields if it's an edit operation
  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [type, noteData]);

  const AddNewNote = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully", "success");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to add note. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const EditNote = async () => {
    setIsLoading(true);
    const noteId = noteData?._id;
    if (!noteId) {
      setError("Note ID is missing");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axiosInstance.put("/edit-note/"+noteId, {
        title,
        content,
        tags,
      });
      
      if(response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "success");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update note. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    // Reset error if all fields are valid
    setError("");

    if (type === "edit") {
      EditNote();
    } else {
      AddNewNote();
    }
  };

  return (
    <motion.div 
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.button
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 absolute top-2 right-2 z-10"
        whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <MdClose className="text-xl" />
      </motion.button>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-900">
          {type === "edit" ? "Edit Note" : "Create New Note"}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 mt-2 rounded-full"></div>
      </div>
      
      {/* Title Field */}
      <motion.div 
        className="flex flex-col gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MdTitle className="text-indigo-600" />
          TITLE
        </label>
        <input
          type="text"
          className="text-xl text-slate-950 outline-none border border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error === "Please enter the title") {
              setError("");
            }
          }}
        />
      </motion.div>

      {/* Content Field */}
      <motion.div 
        className="flex flex-col gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MdNotes className="text-indigo-600" />
          CONTENT
        </label>
        <textarea
          className="text-base text-slate-950 outline-none bg-gray-50 border border-gray-200 p-3 rounded-lg min-h-[200px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          placeholder="Write your note content here..."
          rows={10}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error === "Please enter the content") {
              setError("");
            }
          }}
        />
      </motion.div>

      {/* Tags Field */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MdLocalOffer className="text-indigo-600" />
          TAGS
        </label>
        <TagsInput tags={tags} setTags={setTags} />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="text-red-500 text-sm mb-6 px-4 py-3 bg-red-50 rounded-lg border border-red-100"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Update Button */}
      <motion.button
        className="flex justify-center items-center font-medium p-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-70"
        onClick={handleAddNote}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>{type === "edit" ? "UPDATING..." : "ADDING..."}</span>
          </div>
        ) : (
          <span>{type === "edit" ? "UPDATE NOTE" : "ADD NOTE"}</span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default AddEditNote;