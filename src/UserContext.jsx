import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      });

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
    <UserContext.Provider value={{ user, setUser }}>
      {childrenWithProps}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
