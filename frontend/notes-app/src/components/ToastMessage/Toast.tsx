import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCheck, LuX } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

interface ToastProps {
  isShown: boolean;
  message: string;
  type: "success" | "error" | "delete";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timeOutId = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [isShown, onClose]);

  // Get the appropriate icon and colors based on toast type
  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <LuCheck />,
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
          accentColor: "bg-green-500",
          progressBarColor: "bg-green-500"
        };
      case "error":
        return {
          icon: <LuX />,
          iconBg: "bg-red-100",
          iconColor: "text-red-500",
          accentColor: "bg-red-500",
          progressBarColor: "bg-red-500"
        };
      case "delete":
        return {
          icon: <MdDeleteOutline />,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-500",
          accentColor: "bg-orange-500",
          progressBarColor: "bg-orange-500"
        };
      default:
        return {
          icon: <LuCheck />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
          accentColor: "bg-blue-500",
          progressBarColor: "bg-blue-500"
        };
    }
  };

  const { icon, iconBg, iconColor, accentColor, progressBarColor } = getToastConfig();

  // Animation variants
  const toastVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      x: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      x: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      } 
    }
  };

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          className="fixed top-20 right-6 z-50"
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="min-w-64 bg-white rounded-lg shadow-xl overflow-hidden flex">
            <div className={`w-1.5 ${accentColor}`}></div>
            
            <div className="flex-1 p-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${iconBg}`}>
                  <span className={`text-lg ${iconColor}`}>{icon}</span>
                </div>
                
                <p className="text-sm font-medium text-gray-700">{message}</p>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <LuX size={16} />
                </motion.button>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div 
              className={`h-1 ${progressBarColor} absolute bottom-0 left-0`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;