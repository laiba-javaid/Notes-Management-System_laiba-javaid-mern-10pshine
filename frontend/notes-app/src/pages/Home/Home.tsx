import { useState, useEffect } from 'react';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import NotesCard from "../../components/Cards/NotesCard";
import Navbar from "../../components/Navbar";
import AddEditNote from './AddEditNote';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/images/add-notes.svg';
import NoDataImg from '../../assets/images/no-data.svg';


const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState<{
    isShown: boolean;
    type: string;
    data: { title: string; 
      content: string; 
      tags: string[] } | null;
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

  const [allNotes, setAllNotes] = useState<{ _id: string; title: string; content: string; tags: string[]; isPinned: boolean; createdOn: string }[]>([]);
  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Toast message handler
const showToastMessage= (message: string, type: "success" | "delete" | "error") => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    type:    "success",
    });
  };

  //Get User Info
  const getUserInfo= async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    }
    catch (error) {
      // Handle error response
     if (axios.isAxiosError(error) && error.response?.status === 401)
     {
      localStorage.clear();
      navigate("/login")
     }
    }
  }

  //Get All Notes
  const getAllNotes = async () => {
    try{
      const response = await axiosInstance.get("/get-all-notes");
      if(response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    }
    catch (error) {
      // Handle error response
    console.error("Error fetching notes:", error);
    }
  }

 //Delete Note
 const deleteNote = async (data: { _id: string; title: string; content: string; tags: string[]; isPinned: boolean; createdOn: string }) => {
  const noteId = data._id;
  
  try {
    const response = await axiosInstance.delete("/delete-note/"+noteId);
    if(response.data && !response.data.error) 
      {
    showToastMessage("Note Deleted Successfully", 'delete'); 
    getAllNotes();
      }

   } catch (error) {
      // Handle error response
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        console.error("Error deleting note:", error.response.data.message);
      }
    }
  };

//Search for a Note
const onSearchNote = async (query: string) => {
  try{
    const response = await axiosInstance.get("/search-notes", 
      { params: { query } });

    if(response.data && response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
    }
    
  }
  catch (error) {
    // Handle error response
    console.error("Error searching notes:", error);
  }
}

const updateIsPinned = async (noteData: { _id: string; isPinned: boolean }) => {
  const noteId = noteData?._id; // Get the note ID from the noteData prop

  if (!noteId) {
    console.error("Note ID is missing");
    return;
  }
  try {
    const response = await axiosInstance.put("/update-note-pinned/"+noteId, {
      "isPinned": !noteData.isPinned,
    });
    if(response.data && response.data.note) 
      {
    showToastMessage("Note Updated Successfully", "success"); 
    getAllNotes(); 
      }
   } catch (error) {
     console.log("Error updating note:", error);
    }
}

const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes();
}

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    
    return () => {
    }
  }
  , [])

 

  const handleEditNote=(noteDetails: { _id: string; title: string; content: string; tags: string[]; isPinned: boolean; createdOn: string })=>{
    setOpenAddEditModal({isShown: true, data: noteDetails, type: 'edit'})
  }


  const handleAddNewNote = () => {
    setOpenAddEditModal({
      isShown: true,
      type: 'add',
      data: null,
    });
  };

  const handleCloseModal = () => {
    setOpenAddEditModal({
      isShown: false,
      type: 'add',
      data: null,
    });
  };

  return (
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto px-8 py-8">
        {allNotes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <NotesCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEditNote(item)} // Edit functionality
              onDelete={() => deleteNote(item)} // Delete functionality}
              onPinNote={() => updateIsPinned(item)} // Pin functionality} 
            />
          ))}
        </div>
        ) : (
          <EmptyCard imgSrc={isSearch? NoDataImg : AddNotesImg} 
          message={isSearch? `Oops! No notes found matching your search` :`Start Creating your first note! Click the "Add" button to write 
            down your thoughts, ideas, and reminders. Let's get started!  `}/>
        )}
      </div>

      {/* Button to Open the Modal */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={handleAddNewNote} // Open Add Modal
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
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
          onClose={handleCloseToast}    />
    </div>
  );
}

export default Home;


