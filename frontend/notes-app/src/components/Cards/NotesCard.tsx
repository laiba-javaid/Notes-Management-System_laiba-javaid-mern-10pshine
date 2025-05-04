import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';
import { TbTag } from 'react-icons/tb';


interface NotesCardProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
  viewMode: string;
}

const NotesCard: React.FC<NotesCardProps> = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  viewMode
}) => {
  // Function to get a random pastel color based on tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-teal-100 text-teal-700',
    ];
    
    // Simple hash function to determine color index
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Format and truncate content appropriately
  const truncatedContent = content.length > 180 
    ? content.slice(0, 180) + '...' 
    : content;

  // Framer Motion animation variants
  const cardVariants = {
    hover: { 
      y: -5, 
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl overflow-hidden transition-all 
        ${viewMode === 'grid' ? '' : 'flex'}`}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      style={{
        backgroundImage: isPinned ? 
          'linear-gradient(to right bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.95)), url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23a3bffa\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' 
          : 'none',
      }}
    >
      {/* Left border accent */}
      <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 ${isPinned ? 'opacity-100' : 'opacity-40'}`}></div>
      
      <div className={`relative flex flex-col p-5 ${viewMode === 'grid' ? '' : 'flex-1'}`}>
        {/* Title and Pin Icon Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h6 className="text-lg font-bold text-gray-800">{title}</h6>
            <span className="text-xs text-gray-500">
              {moment(date).format("MMM DD, YYYY")}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.2, rotate: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPinNote}
            aria-label="pin note"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MdOutlinePushPin 
              className={`text-xl ${isPinned ? 'text-indigo-600' : 'text-gray-400'}`}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className="my-3">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {truncatedContent}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-4 mb-2 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <motion.span 
                key={index} 
                className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <TbTag className="mr-1" />
                {tag}
              </motion.span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex items-center justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600"
            aria-label="edit note"
          >
            <MdCreate className="text-lg" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-red-50 text-red-500"
            aria-label="delete note"
          >
            <MdDelete className="text-lg" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotesCard;
