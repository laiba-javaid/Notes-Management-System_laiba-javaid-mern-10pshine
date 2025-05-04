import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  imgSrc: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ imgSrc, message }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Image with animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative"
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-indigo-100 opacity-50"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut" 
          }}
          style={{ width: '100%', height: '100%', zIndex: -1 }}
        />
        <img 
          src={imgSrc} 
          alt="Empty State" 
          className="w-56 h-56 object-contain relative z-10" 
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 max-w-md text-center"
      >
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          {message.split('!')[0]}
          {message.includes('!') && 
            <motion.span 
              className="text-indigo-600 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              !
            </motion.span>
          }
        </h2>
        {message.includes('!') && message.split('!')[1] && (
          <p className="text-gray-500 mt-2">
            {message.split('!')[1]}
          </p>
        )}
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute z-0 opacity-30">
        <motion.div 
          className="bg-indigo-200 rounded-full w-64 h-64 absolute -top-32 -left-32"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="bg-purple-200 rounded-full w-48 h-48 absolute -bottom-24 -right-24"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </motion.div>
  );
};

export default EmptyState;