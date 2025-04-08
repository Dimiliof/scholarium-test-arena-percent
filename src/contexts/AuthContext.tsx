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
  role?: "teacher" | "student";
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
  fixAdminEmail: (email: string) => Promise<boolean>;
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
  fixAdminEmail: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);

  useEffect(() => {
    // Διόρθωση του email του διαχειριστή κατά την εκκίνηση
    fixAdminEmailOnStartup();
    
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
  
  // Διόρθωση του email του διαχειριστή κατά την εκκίνηση
  const fixAdminEmailOnStartup = () => {
    const adminEmail = "liofisdimitris@gmail.com";
    const storedUsers = localStorage.getItem("users");
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      let needsUpdate = false;
      
      const updatedUsers = users.map((u: User) => {
        if (u.email === adminEmail) {
          needsUpdate = true;
          console.log(`Διόρθωση ρόλου για τον διαχειριστή ${adminEmail} από ${u.role} σε admin`);
          return { ...u, role: "admin" as const };
        }
        return u;
      });
      
      if (needsUpdate) {
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        console.log("Ενημερώθηκε η λίστα χρηστών για τον διαχειριστή");
        
        // Αν ο συνδεδεμένος χρήστης είναι ο διαχειριστής, ενημερώνουμε και αυτόν
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          if (parsedUser.email === adminEmail) {
            parsedUser.role = "admin";
            localStorage.setItem("user", JSON.stringify(parsedUser));
            console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης-διαχειριστής");
          }
        }
      } else {
        // Αν δεν υπάρχει ο διαχειριστής, τον δημιουργούμε
        const adminExists = users.some((u: User) => u.email === adminEmail);
        if (!adminExists) {
          console.log("Ο διαχειριστής δεν υπάρχει, τον δημιουργούμε");
          const newAdmin = {
            id: Math.random().toString(36).substring(2, 15),
            firstName: "Διαχειριστής",
            lastName: "Συστήματος",
            email: adminEmail,
            password: "admin12345",
            role: "admin" as const,
          };
          users.push(newAdmin);
          localStorage.setItem("users", JSON.stringify(users));
          console.log("Δημιουργήθηκε ο διαχειριστής:", newAdmin);
        }
      }
    } else {
      // Αν δεν υπάρχουν χρήστες, δημιουργούμε τον διαχειριστή
      const newAdmin = {
        id: Math.random().toString(36).substring(2, 15),
        firstName: "Διαχειριστής",
        lastName: "Συστήματος",
        email: adminEmail,
        password: "admin12345",
        role: "admin" as const,
      };
      localStorage.setItem("users", JSON.stringify([newAdmin]));
      console.log("Δημιουργήθηκε αρχικός διαχειριστής:", newAdmin);
    }
  };
  
  // Λειτουργία διόρθωσης ρόλου για συγκεκριμένο email
  const fixAdminEmail = async (email: string): Promise<boolean> => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (!storedUsers) {
        // Αν δεν υπάρχουν χρήστες, δημιουργούμε τον διαχειριστή
        const newAdmin = {
          id: Math.random().toString(36).substring(2, 15),
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: email,
          password: "admin12345",
          role: "admin" as const,
        };
        localStorage.setItem("users", JSON.stringify([newAdmin]));
        console.log("Δημιουργήθηκε αρχικός διαχειριστής:", newAdmin);
        return true;
      }
      
      const users = JSON.parse(storedUsers);
      let userFound = false;
      
      const updatedUsers = users.map((u: User & { password?: string }) => {
        if (u.email === email) {
          userFound = true;
          console.log(`Ο χρήστης ${email} βρέθηκε. Ενημέρωση ρόλου σε admin.`);
          return { ...u, role: "admin" as const };
        }
        return u;
      });
      
      if (!userFound) {
        // Αν δεν υπάρχει ο χρήστης, τον δημιουργούμε
        console.log(`Ο χρήστης ${email} δεν βρέθηκε. Δημιουργία νέου διαχειριστή.`);
        const newAdmin = {
          id: Math.random().toString(36).substring(2, 15),
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: email,
          password: "admin12345",
          role: "admin" as const,
        };
        updatedUsers.push(newAdmin);
      }
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      console.log("Η λίστα χρηστών ενημερώθηκε επιτυχώς");
      
      // Αν ο συνδεδεμένος χρήστης είναι αυτός που ενημερώνουμε, ενημερώνουμε και το user state
      if (user && user.email === email) {
        const updatedUser: User = { ...user, role: "admin" as const };
        setUser(updatedUser);
        setIsAdmin(true);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης");
      }
      
      return true;
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) return false;

    const users = JSON.parse(storedUsers);
    const user = users.find((u: User & { password?: string }) => u.email === email && u.password === password);

    if (user) {
      // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
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
      // Ελέγχουμε αν το email υπάρχει ήδη
      const storedUsers = localStorage.getItem("users");
      let users = [];
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        const existingUser = users.find((u: User) => u.email === userData.email);
        if (existingUser) {
          return false; // Το email υπάρχει ήδη
        }
      }
      
      // Καθορίζουμε τον ρόλο (αν δεν έχει καθοριστεί, ο προεπιλεγμένος είναι "student")
      const role = userData.role || "student";
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: role as "admin" | "teacher" | "student",
      };

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
        loginRecords,
        fixAdminEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
