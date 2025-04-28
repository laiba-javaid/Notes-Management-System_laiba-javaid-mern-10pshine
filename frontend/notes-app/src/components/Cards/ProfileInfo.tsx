import React from "react";
import { getInitials } from "../../utils/helper"; // Import the helper function

interface UserInfo {
  fullName: string;
  // You can add other fields like email, id, etc., here if needed
}

interface ProfileInfoProps {
  userInfo: UserInfo | null; // userInfo can now be null safely
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-black">
          ?
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-medium">Guest</p>
          <button
            className="text-sm text-slate-700 underline mt-1 hover:cursor-pointer"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Avatar with initials */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-black">
        {getInitials(userInfo.fullName)}
      </div>

      {/* Right side: Username and Logout */}
      <div className="flex flex-col items-start justify-center">
        <p className="text-sm font-medium">{userInfo.fullName}</p>
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
