import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}: {
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      {/* Title and Pin Icon Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h6 className="text-lg font-bold">{title}</h6>
          <span className="text-xs text-slate-500">{moment(date).format("DD-MMM-YYYY")}</span>
        </div>
        <MdOutlinePushPin
          data-testid="pin-icon"
          aria-label="pin note"
          className={`cursor-pointer ${isPinned ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700`}
          onClick={onPinNote}
        />
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 mb-2 pt-3">{content.slice(0, 60)}</p>

      {/* Tags */}
      <div className="mt-4 text-xs text-slate-400">
        {tags.map((item, index) => (
          <span key={index} className="text-blue-500 mr-1">#{item}</span>
        ))}
      </div>

      {/* Edit and Delete Icons */}
      <div className="flex items-center justify-end gap-4 mt-4">
        <MdCreate
          aria-label="edit"
          className="cursor-pointer text-gray-500 hover:text-green-600"
          onClick={onEdit}
        />
        <MdDelete
          aria-label="delete"
          className="cursor-pointer text-gray-500 hover:text-red-500"
          onClick={onDelete}
        />
      </div> 
    </div>
  );
};

export default NoteCard;
