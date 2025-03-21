import { useState, useEffect } from "react";
import TagsInput from "../../components/Inputs/TagsInput";
import { MdClose } from "react-icons/md";

interface AddEditNoteProps {
  noteData?: { title: string; content: string; tags: string[] } | null;  // Allowing null
  type?: string;
  onClose: () => void;
}

const AddEditNote = ({ noteData, type, onClose }: AddEditNoteProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Populate fields if it's an edit operation
  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [type, noteData]);

  const AddNewNote = () => {
    // Logic to add a new note
    console.log("Adding new note:", { title, content, tags });
  };

  const EditNote = () => {
    // Logic to edit the existing note
    console.log("Editing note:", { title, content, tags });
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
    <div className="relative">
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 absolute top-3 right-3"
      >
        <MdClose className="text-xl" />
      </button>
      {/* Title Field */}
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content Field */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Tags Field */}
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagsInput tags={tags} setTags={setTags} />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Add Button */}
      <button
        className="flex justify-center items-center font-medium mt-5 p-3 w-full max-w-xs mx-auto bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        onClick={handleAddNote}
      >
        ADD
      </button>
    </div>
  );
};

export default AddEditNote;
