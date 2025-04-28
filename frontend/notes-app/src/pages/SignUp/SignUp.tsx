import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser } from "react-icons/fa";
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

  const navigate = useNavigate();

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

    // Call the Signup API
    try{
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
        return;
      }

      // If server sends accessToken
      if (typeof data?.accessToken === "string") {
        localStorage.setItem("token", data.accessToken);
        navigate("/dashboard");
        return;
      }

    // ❗ If none of the above (something weird)
    setError("Unexpected response from server. Please try again.");
  } catch (error) {
    if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
      setError(error.response.data.message);
    } else {
      setError("An error occurred. Please try again.");
    }
  }
  };

  return (
    <>
     
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Sign Up
          </h2>

          <form onSubmit={(e) => HandleSignup(e)}>
            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2">Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
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
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
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
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2">Password</label>
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
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-medium underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
