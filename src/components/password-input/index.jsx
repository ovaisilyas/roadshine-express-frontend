import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../static/css/PasswordInput.css";

const PasswordInput = ({ value, onChange, placeholder, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <FontAwesomeIcon
        icon={showPassword ? faEyeSlash : faEye}
        className="eye-icon"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
};

export default PasswordInput;