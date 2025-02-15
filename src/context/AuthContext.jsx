import { createContext, useState, useEffect } from "react";
import users from "../data/users";

// Create a context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = (email, password, role) => {
    console.log(email, password, role);
    const foundUser = users.find(
      (user) =>
        user.email === email && user.password === password && user.role === role
    );

    console.log("Found User", foundUser);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser)); // Save to localStorage
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
