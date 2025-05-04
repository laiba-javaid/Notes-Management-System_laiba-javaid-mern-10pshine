import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from '../../utils/axiosInstance';
import { HiOutlineSparkles } from 'react-icons/hi';
import { IoGridOutline, IoListOutline } from 'react-icons/io5';

// Custom components
import NotesCard from "../../components/Cards/NotesCard";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNote from './AddEditNote';
import Toast from '../../components/ToastMessage/Toast';
import EmptyState from '../../components/EmptyCard/EmptyCard';

// Images
import AddNotesImg from '../../assets/images/add-notes.svg';
import NoDataImg from '../../assets/images/no-data.svg';

export type NoteType = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdOn: string;
};

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState<{
    isShown: boolean;
    type: string;
    data: NoteType | null;
  }>({ isShown: false, type: 'add', data: null });

  const [showToastMsg, setShowToastMsg] = useState<{
    isShown: boolean;
    type: "success" | "error" | "delete";
    message: string;
  }>({
    isShown: false,
    type: "success",
    message: "",
  });

  const [allNotes, setAllNotes] = useState<NoteType[]>([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const navigate = useNavigate();

  // Toast message handler
  const showToastMessage = useCallback((message: string, type: "success" | "delete" | "error") => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  }, []);

  const handleCloseToast = useCallback(() => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "success",
    });
  }, []);

  // Get User Info
  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  // Get All Notes
  const getAllNotes = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, []);

  // Delete Note
  const deleteNote = useCallback(async (data: NoteType) => {
    const noteId = data._id;
    
    try {
      // First update the UI for immediate feedback
      setAllNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      
      // Then make the API call
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
      } else {
        // If something went wrong with the API call, reload all notes to restore state
        getAllNotes();
        showToastMessage("Note Deleted Successfully", 'delete');
      }
    } catch (error) {
      // If there was an error, reload all notes to restore state
      getAllNotes();
      
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        console.error("Error deleting note:", error.response.data.message);
        showToastMessage("Failed to delete note", 'error');
      } else {
        showToastMessage("An unexpected error occurred", 'error');
      }
    }
  }, [getAllNotes, showToastMessage]);

  // Search for a Note
  const onSearchNote = useCallback(async (query: string) => {
    try {
      const response = await axiosInstance.get("/search-notes", { params: { query } });
      
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  }, []);

  // Update isPinned status
  const updateIsPinned = useCallback(async (noteData: { _id: string; isPinned: boolean }) => {
    const noteId = noteData?._id;

    if (!noteId) {
      console.error("Note ID is missing");
      return;
    }
    
    try {
      // First update the UI for immediate feedback
      setAllNotes(prevNotes => prevNotes.map(note => 
        note._id === noteId ? { ...note, isPinned: !noteData.isPinned } : note
      ));
      
      // Then make the API call
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        "isPinned": !noteData.isPinned,
      });
      
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "success");
        getAllNotes();
      } else {
        // If something went wrong with the API call, reload all notes to restore state
        getAllNotes();
        showToastMessage("Failed to update note", "error");
      }
    } catch (error) {
      // If there was an error, reload all notes to restore state
      getAllNotes();
      console.log("Error updating note:", error);
      showToastMessage("Failed to update note", "error");
    }
  }, [getAllNotes, showToastMessage]);

  const handleClearSearch = useCallback(() => {
    setIsSearch(false);
    getAllNotes();
  }, [getAllNotes]);

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, [getAllNotes, getUserInfo]);

  const handleEditNote = useCallback((noteDetails: NoteType) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' });
  }, []);

  const handleAddNewNote = useCallback(() => {
    setOpenAddEditModal({
      isShown: true,
      type: 'add',
      data: null,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenAddEditModal({
      isShown: false,
      type: 'add',
      data: null,
    });
  }, []);

  // Filter notes based on the active filter category
  const filteredNotes = allNotes.filter(note => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'pinned') return note.isPinned;
    return false;
  });

  // Animation variants for different elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch}
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-indigo-900">My Notes</h1>
            <HiOutlineSparkles className="text-amber-500 text-xl" />
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-6 bg-white p-1 rounded-lg shadow-sm">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
                onClick={() => setViewMode('grid')}
              >
                <IoGridOutline size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
              >
                <IoListOutline size={18} />
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeCategoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
                onClick={() => setActiveCategoryFilter('all')}
              >
                All Notes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeCategoryFilter === 'pinned' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
                onClick={() => setActiveCategoryFilter('pinned')}
              >
                Pinned
              </motion.button>
            </div>
          </div>
        </div>
        
        {filteredNotes.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 
              "flex flex-col space-y-4"
            }
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotesCard
                    title={note.title}
                    date={note.createdOn}
                    content={note.content}
                    tags={note.tags}
                    isPinned={note.isPinned}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => deleteNote(note)}
                    onPinNote={() => updateIsPinned(note)}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState 
              imgSrc={isSearch ? NoDataImg : AddNotesImg}
              message={isSearch 
                ? `Oops! No notes found matching your search` 
                : `Start creating your first note! Click the "Add" button to write 
                  down your thoughts, ideas, and reminders. Let's get started!`}
            />
          </motion.div>
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 fixed right-10 bottom-10 shadow-lg"
        onClick={handleAddNewNote}
        whileHover={{ scale: 1.1, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <MdAdd className="text-3xl text-white" />
      </motion.button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
          content: {
            inset: "unset",
            margin: "60px auto",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            padding: "24px",
          }
        }}
        contentLabel=""
        className="w-1/2 max-h-3/4 bg-white rounded-xl mx-auto overflow-auto"
      >
        <AddEditNote 
          type={openAddEditModal.type} 
          noteData={openAddEditModal.data}
          onClose={handleCloseModal}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      {/* Toast Message */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;