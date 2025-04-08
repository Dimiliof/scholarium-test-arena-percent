
import React, { createContext, useState, useEffect, useContext } from "react";

// Τύπος δεδομένων για την εγγραφή
type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  school?: string;
  classYear?: string;
  termsAccepted: boolean;
};

// Τύπος χρήστη
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "teacher" | "student";
  profileImage?: string | null;
};

// Τύπος καταγραφής σύνδεσης
export type LoginRecord = {
  userId: string;
  userName: string;
  email: string;
  role: string;
  timestamp: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getAllUsers: () => User[];
  loginRecords: LoginRecord[];
};

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
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === "admin");
      setIsTeacher(parsedUser.role === "teacher");
    }
    
    // Φόρτωση των καταγραφών σύνδεσης
    const storedRecords = localStorage.getItem("loginRecords");
    if (storedRecords) {
      setLoginRecords(JSON.parse(storedRecords));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) return false;

    const users = JSON.parse(storedUsers);
    const user = users.find((u: User & { password?: string }) => u.email === email && u.password === password);

    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
      setIsAdmin(user.role === "admin");
      setIsTeacher(user.role === "teacher");
      
      // Καταγραφή της σύνδεσης
      const loginRecord: LoginRecord = {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        timestamp: Date.now(),
      };
      
      const records = [...loginRecords, loginRecord];
      setLoginRecords(records);
      localStorage.setItem("loginRecords", JSON.stringify(records));
      
      return true;
    }

    return false;
  };

  const register = async (userData: RegisterData) => {
    try {
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        ...userData,
        role: "student",
      };

      const storedUsers = localStorage.getItem("users");
      let users = [];

      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsTeacher(false);
    localStorage.removeItem("user");
  };
  
  // Ενημέρωση προφίλ χρήστη
  const updateUserProfile = async (updatedUser: User) => {
    try {
      // Σε μια πραγματική εφαρμογή, θα στέλναμε τα δεδομένα στον server
      // Για την προσομοίωση, ενημερώνουμε απλά το localStorage
      
      // Διατηρούμε τους άλλους χρήστες και επικαιροποιούμε μόνο τον τρέχοντα
      const usersString = localStorage.getItem("users");
      if (usersString) {
        const users = JSON.parse(usersString);
        const updatedUsers = users.map((u: User) => 
          u.id === updatedUser.id ? updatedUser : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
      
      // Ενημερώνουμε τον τρέχοντα χρήστη
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      console.log("Το προφίλ ενημερώθηκε με επιτυχία:", updatedUser);
      
      return true;
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του προφίλ:", error);
      return false;
    }
  };
  
  // Αλλαγή κωδικού πρόσβασης
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    
    try {
      // Σε μια πραγματική εφαρμογή, θα στέλναμε τα δεδομένα στον server για επικύρωση
      // και αλλαγή κωδικού
      
      // Για την προσομοίωση, ελέγχουμε τον τρέχοντα κωδικό και ενημερώνουμε τον νέο
      const usersString = localStorage.getItem("users");
      if (!usersString) return false;
      
      const users = JSON.parse(usersString);
      const userIndex = users.findIndex((u: User & { password: string }) => 
        u.id === user.id && u.password === currentPassword
      );
      
      if (userIndex === -1) {
        console.error("Λάθος τρέχων κωδικός");
        return false;
      }
      
      // Ενημερώνουμε τον κωδικό
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      
      console.log("Ο κωδικός άλλαξε με επιτυχία");
      
      return true;
    } catch (error) {
      console.error("Σφάλμα κατά την αλλαγή κωδικού:", error);
      return false;
    }
  };
  
  // Λήψη όλων των χρηστών (για διαχειριστές)
  const getAllUsers = () => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) return [];
    
    return JSON.parse(storedUsers);
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
        loginRecords
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
