import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaEnvelope } from "react-icons/fa";
import PasswordInput from "../../components/Inputs/PasswordInput";
import { useState } from "react";
import validEmail from "../../utils/helper";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const HandleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // If there's already an error, don't reset it unless the specific field is corrected
    if (!error || error === "Please enter a valid email address") {
      if (!validEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
    }

    if (!error || error === "Password is required") {
      if (!password) {
        setError("Password is required");
        return;
      }
    }

    setError(null); // Clear error if everything is valid

    // Call the login API
    console.log("Logging in with:", { email, password });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Login
          </h2>

          <form onSubmit={(e) => HandleLogin(e)}>
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
                  required
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
              Login
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 font-medium underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
