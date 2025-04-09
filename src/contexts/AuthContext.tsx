
import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  User, 
  LoginRecord, 
  RegisterData, 
  AuthContextType 
} from "@/types/auth";
import { 
  fixAdminEmailOnStartup, 
  loginUser, 
  registerUser, 
  getAllUsersFromStorage 
} from "@/services/authService";
import { useAdminFunctions } from "@/hooks/useAdminFunctions";
import { useUserManagement } from "@/hooks/useUserManagement";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isTeacher: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserProfile: async () => false,
  changePassword: async () => false,
  getAllUsers: () => [],
  loginRecords: [],
  fixAdminEmail: async () => false,
  makeUserTeacherAndAdmin: async () => false,
});

export const useAuth = () => useContext(AuthContext);

// Properly defined function component with React.FC type
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);

  // Χρησιμοποιούμε τα custom hooks
  const { isAdmin, setIsAdmin, fixAdminEmail, makeUserTeacherAndAdmin } = useAdminFunctions(setUser);
  const { isTeacher, setIsTeacher, updateUserProfile, changePassword: changeUserPassword } = useUserManagement();

  useEffect(() => {
    // Διόρθωση του email του διαχειριστή κατά την εκκίνηση
    fixAdminEmailOnStartup();
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === "admin" || (parsedUser.roles && parsedUser.roles.includes("admin")));
      setIsTeacher(parsedUser.role === "teacher" || (parsedUser.roles && parsedUser.roles.includes("teacher")));
    }
    
    // Φόρτωση των καταγραφών σύνδεσης
    const storedRecords = localStorage.getItem("loginRecords");
    if (storedRecords) {
      setLoginRecords(JSON.parse(storedRecords));
    }
  }, [setIsAdmin, setIsTeacher]);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUser(email, password, loginRecords, setLoginRecords);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      // Ελέγχουμε και για τους πολλαπλούς ρόλους
      setIsAdmin(loggedInUser.role === "admin" || (loggedInUser.roles && loggedInUser.roles.includes("admin")));
      setIsTeacher(loggedInUser.role === "teacher" || (loggedInUser.roles && loggedInUser.roles.includes("teacher")));
      
      return true;
    }

    return false;
  };

  const register = async (userData: RegisterData) => {
    return await registerUser(userData);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsTeacher(false);
    localStorage.removeItem("user");
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    return await changeUserPassword(user, currentPassword, newPassword);
  };
  
  const getAllUsers = () => {
    return getAllUsersFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isTeacher,
        login,
        register,
        logout,
        updateUserProfile,
        changePassword,
        getAllUsers,
        loginRecords,
        fixAdminEmail,
        makeUserTeacherAndAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
