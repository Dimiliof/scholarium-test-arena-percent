import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContextType, User, RegisterData, LoginRecord } from "../types/auth";
import { checkIsAdmin, checkIsTeacher, getUserFromLocalStorage } from "../utils/authUtils";
import { fixAdminEmailOnStartup, fixAdminEmail, makeUserTeacherAndAdmin } from "../utils/adminUtils";
import { useUserOperations } from "../hooks/useUserOperations";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);
  
  const userOperations = useUserOperations();

  useEffect(() => {
    // Διόρθωση του email του διαχειριστή κατά την εκκίνηση
    fixAdminEmailOnStartup();
    
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(checkIsAdmin(storedUser));
      setIsTeacher(checkIsTeacher(storedUser));
    }
    
    // Φόρτωση των καταγραφών σύνδεσης
    const storedRecords = localStorage.getItem("loginRecords");
    if (storedRecords) {
      setLoginRecords(JSON.parse(storedRecords));
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Προσπάθεια σύνδεσης από το AuthContext με email:", email);
    
    // Για τον κύριο διαχειριστή χρησιμοποιούμε απευθείας το useUserOperations
    const success = await userOperations.login(email, password, loginRecords, setLoginRecords);
    
    if (success) {
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(checkIsAdmin(storedUser));
        setIsTeacher(checkIsTeacher(storedUser));
      }
    }
    
    return success;
  };

  const register = async (userData: RegisterData) => {
    return await userOperations.register(userData);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsTeacher(false);
    localStorage.removeItem("user");
  };
  
  const updateUserProfile = async (updatedUser: User) => {
    const success = await userOperations.updateUserProfile(updatedUser);
    
    if (success) {
      setUser(updatedUser);
      setIsAdmin(checkIsAdmin(updatedUser));
      setIsTeacher(checkIsTeacher(updatedUser));
    }
    
    return success;
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    return await userOperations.changePassword(currentPassword, newPassword, user);
  };
  
  const getAllUsers = () => {
    return userOperations.getAllUsers();
  };

  const handleFixAdminEmail = async (email: string) => {
    return await fixAdminEmail(email);
  };

  const handleMakeUserTeacherAndAdmin = async (email: string) => {
    const success = await makeUserTeacherAndAdmin(email);
    
    if (success && user && user.email === email) {
      // Ενημέρωση του τοπικού χρήστη με τα νέα δικαιώματα
      const updatedUser = {
        ...user,
        role: "admin" as const,
        roles: ["admin", "teacher"]
      };
      setUser(updatedUser);
      setIsAdmin(true);
      setIsTeacher(true);
    }
    
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isTeacher,
        login,
        register: userOperations.register,
        logout: () => {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsTeacher(false);
          localStorage.removeItem("user");
        },
        updateUserProfile,
        changePassword,
        getAllUsers: userOperations.getAllUsers,
        loginRecords,
        fixAdminEmail: handleFixAdminEmail,
        makeUserTeacherAndAdmin: handleMakeUserTeacherAndAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
