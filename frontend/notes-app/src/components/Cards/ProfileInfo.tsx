import React from "react";
import { getInitials } from "../../utils/helper"; // Import the helper function

const ProfileInfo: React.FC = () => {
  const userName: string = "John William"; // Hardcoded username or fetched from state
  const onLogout = (): void => {
    console.log("User logged out");
    // Implement your logout logic here, like redirecting to the login page.
  };

  return (
    <div className="flex items-center gap-4">
      {/* Avatar with initials */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-black">
        {getInitials(userName)}
      </div>

      {/* Right side: Username and Logout */}
      <div className="flex flex-col items-start justify-center">
        <p className="text-sm font-medium">{userName}</p>
        <button
          className="text-sm text-slate-700 underline mt-1 hover:cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
