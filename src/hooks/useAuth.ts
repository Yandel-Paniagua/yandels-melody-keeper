import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("yandels_auth");
    setIsAuthenticated(auth === "true");
  }, []);

  const login = (user: string, password: string): boolean => {
    if (user === "admin" && password === "admin123456") {
      localStorage.setItem("yandels_auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("yandels_auth");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
