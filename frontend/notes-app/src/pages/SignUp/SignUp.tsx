import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import PasswordInput from "../../components/Inputs/PasswordInput";
import { useState } from "react";
import validEmail from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      } 
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5
      }
    },
    hover: { 
      scale: 1.03,
      backgroundColor: "#3b82f6",
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

  const HandleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if(!name)
    {
      setError("Name is required");
      return;
    }

    if(!validEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

   if(!password) {
      setError("Password is required");
      return;
    }

    setError(null); // Clear error if everything is valid
    setIsLoading(true);

    // Call the Signup API
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      const data = response.data;
      console.log("Server response:", data);
      
      // If server sends error as string
      if (typeof data?.error === "string") {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      // If server sends accessToken
      if (typeof data?.accessToken === "string") {
        localStorage.setItem("token", data.accessToken);
        
        // Small delay for visual feedback
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);
        
        return;
      }

      // ❗ If none of the above (something weird)
      setError("Unexpected response from server. Please try again.");
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl font-bold text-center text-indigo-900 mb-8"
          variants={childVariants}
        >
          Sign Up
        </motion.h2>

        <form onSubmit={(e) => HandleSignup(e)}>
          {/* Name Input */}
          <motion.div 
            className="mb-5"
            variants={childVariants}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error === "Name is required" && e.target.value.trim()) {
                    setError(null);
                  }
                }}
                placeholder="Enter your name"
                className="w-full bg-transparent outline-none ml-2 text-gray-700"
              />
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div 
            className="mb-5"
            variants={childVariants}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === "Please enter a valid email address" && validEmail(e.target.value)) {
                    setError(null);
                  }
                }}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none ml-2 text-gray-700"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div 
            className="mb-5"
            variants={childVariants}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <PasswordInput
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (error === "Password is required" && e.target.value) {
                  setError(null);
                }
              }}
              placeholder="Enter your password"
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.p 
              className="text-red-500 text-sm mb-5 px-3 py-2 bg-red-50 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-70"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Signing up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </motion.button>

          <motion.p 
            className="text-sm text-gray-600 text-center mt-6"
            variants={childVariants}
          >
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200">
              Login
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;