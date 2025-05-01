import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center border-[1.5px] bg-transparent px-5 rounded mt-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      <button type="button" onClick={toggleShowPassword} role="button" data-testid="toggle-password">
        {isShowPassword ? (
            <FaRegEye size={22} className="text-primary cursor-pointer" />) 
            : 
            (<FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
