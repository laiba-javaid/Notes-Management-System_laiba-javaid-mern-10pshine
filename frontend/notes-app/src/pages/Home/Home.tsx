import { useState } from 'react';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import NotesCard from "../../components/Cards/NotesCard";
import Navbar from "../../components/Navbar";
import AddEditNote from './AddEditNote';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState<{
    isShown: boolean;
    type: string;
    data: { title: string; content: string; tags: string[] } | null;
  }>({ isShown: false, type: 'add', data: null });

  const notes = [
    {
      title: "Meeting on 7th April",
      date: "3rd Apr 2024",
      content: "Meeting on 7th April Meeting on 7th April",
      tags: ["#Meeting"],
      isPinned: true,
    },
    // Add more notes as needed
  ];

  const handleEditNote = (noteData: { title: string; content: string; tags: string[] }) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteData,
    });
  };

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
      <Navbar />
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {notes.map((note, index) => (
            <NotesCard
              key={index}
              title={note.title}
              date={note.date}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEditNote(note)} // Edit functionality
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
        </div>
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
        />
      </Modal>
    </div>
  );
};

export default Home;
