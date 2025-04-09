
import React, { createContext, useContext } from "react";
import { User, AuthContextType } from "@/types/auth";
import { getAllUsersFromStorage } from "@/services/authService";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useUserManagement } from "@/hooks/useUserManagement";

// Create context with default values
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

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuthInitialization();
  const { login: authLogin, register, logout: authLogout, loginRecords } = useAuthOperations();
  const { isAdmin, isTeacher, fixAdminEmail, makeUserTeacherAndAdmin } = useRoleManagement(user);
  const { updateUserProfile, changePassword } = useUserManagement();

  // Login function that updates state after successful login
  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = await authLogin(email, password);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Logout function that clears state
  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get all users from storage
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
