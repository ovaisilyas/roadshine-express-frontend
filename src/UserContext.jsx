import React, { createContext, useContext, useState, useEffect } from "react";
import "./static/css/SessionPopup.css"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Function to handle session expiration
  const handleSessionExpiry = () => {
      setUser(null); // Clear user from context
      localStorage.removeItem("user"); // Remove from local storage
      localStorage.removeItem("authToken"); // Remove expired token
      setIsSessionExpired(true); // Show session expired popup
  };

  // Sync localStorage when user state changes
  useEffect(() => {
      if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      } else {
      localStorage.removeItem("user");
      }
  }, [user]);

  // Inject `user` and `setUser` props into children
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { user, setUser })
  );

  return (
    <UserContext.Provider value={{ user, setUser, handleSessionExpiry }}>
      {childrenWithProps}
      {isSessionExpired && (
                <div className="session-popup">
                    <div className="session-popup-content">
                        <h3>Your session has expired</h3>
                        <p>Kindly log in again to continue.</p>
                        <button
                            onClick={() => {
                              setIsSessionExpired(false);
                              window.location.href = "/signin";
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            )}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
