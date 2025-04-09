
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
      
      // Βελτιωμένος έλεγχος ρόλων για συνέπεια σε διαφορετικούς υπολογιστές
      const isUserAdmin = parsedUser.role === "admin" || 
                         (parsedUser.roles && parsedUser.roles.includes("admin")) ||
                         parsedUser.email === "liofisdimitris@gmail.com";
                         
      const isUserTeacher = parsedUser.role === "teacher" || 
                           (parsedUser.roles && parsedUser.roles.includes("teacher")) ||
                           parsedUser.email === "liofisdimitris@gmail.com";
      
      setIsAdmin(isUserAdmin);
      setIsTeacher(isUserTeacher);
      
      // Βεβαιωνόμαστε ότι ο κύριος διαχειριστής έχει πάντα όλα τα δικαιώματα
      if (parsedUser.email === "liofisdimitris@gmail.com" && (!parsedUser.roles || !parsedUser.roles.includes("admin"))) {
        console.log("Αυτόματη προσθήκη δικαιωμάτων διαχειριστή για τον κύριο λογαριασμό");
        makeUserTeacherAndAdmin(parsedUser.email).then(success => {
          if (success) {
            console.log("Επιτυχής ενημέρωση δικαιωμάτων");
          }
        });
      }
    }
    
    // Φόρτωση των καταγραφών σύνδεσης
    const storedRecords = localStorage.getItem("loginRecords");
    if (storedRecords) {
      setLoginRecords(JSON.parse(storedRecords));
    }
  }, [setIsAdmin, setIsTeacher, makeUserTeacherAndAdmin]);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUser(email, password, loginRecords, setLoginRecords);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      // Βελτιωμένος έλεγχος ρόλων
      const isUserAdmin = loggedInUser.role === "admin" || 
                         (loggedInUser.roles && loggedInUser.roles.includes("admin")) ||
                         loggedInUser.email === "liofisdimitris@gmail.com";
                         
      const isUserTeacher = loggedInUser.role === "teacher" || 
                           (loggedInUser.roles && loggedInUser.roles.includes("teacher")) ||
                           loggedInUser.email === "liofisdimitris@gmail.com";
      
      setIsAdmin(isUserAdmin);
      setIsTeacher(isUserTeacher);
      
      // Βεβαιωνόμαστε ότι ο κύριος διαχειριστής αποκτά τους σωστούς ρόλους
      if (email === "liofisdimitris@gmail.com") {
        makeUserTeacherAndAdmin(email);
      }
      
      return true;
    }

    return false;
  };

  const register = async (userData: RegisterData) => {
    return await registerUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsTeacher(false);
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
