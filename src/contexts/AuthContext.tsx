
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Ορισμός του ρόλου χρήστη
export type UserRole = "student" | "teacher" | "admin";

// Ορισμός του τύπου χρήστη
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

// Ορισμός του τύπου για την καταγραφή σύνδεσης
export type LoginRecord = {
  userId: string;
  userName: string;
  email: string;
  timestamp: number;
  role: UserRole;
};

// Ορισμός του τύπου για το context
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  loginRecords: LoginRecord[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
};

// Δημιουργία context με αρχικές τιμές
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isTeacher: false,
  loginRecords: [],
  login: async () => false,
  register: async () => false,
  logout: () => {},
  getAllUsers: () => [],
});

// Hook για εύκολη χρήση του context
export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);

  // Έλεγχος για υπάρχουσα σύνδεση κατά την αρχικοποίηση
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Βεβαιωνόμαστε ότι ο χρήστης έχει ρόλο, και αν όχι, προσθέτουμε τον προεπιλεγμένο
        if (!parsedUser.role) {
          parsedUser.role = "student";
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        console.log("Φορτώθηκε ο χρήστης από το localStorage:", parsedUser);
      } catch (error) {
        console.error("Σφάλμα ανάλυσης αποθηκευμένου χρήστη:", error);
        localStorage.removeItem("user");
      }
    }
    
    // Φόρτωση των καταγραφών συνδέσεων
    const storedRecords = localStorage.getItem("login_records");
    if (storedRecords) {
      try {
        const parsedRecords = JSON.parse(storedRecords);
        setLoginRecords(parsedRecords);
      } catch (error) {
        console.error("Σφάλμα ανάλυσης καταγραφών συνδέσεων:", error);
      }
    }
  }, []);

  // Βοηθητικές συναρτήσεις για τον έλεγχο ρόλων
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  // Προσθήκη καταγραφής σύνδεσης
  const addLoginRecord = (user: User) => {
    const newRecord: LoginRecord = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      timestamp: Date.now(),
      role: user.role,
    };
    
    // Προσθήκη στο state
    const updatedRecords = [newRecord, ...loginRecords].slice(0, 100); // Κρατάμε μέχρι 100 καταγραφές
    setLoginRecords(updatedRecords);
    
    // Αποθήκευση στο localStorage
    localStorage.setItem("login_records", JSON.stringify(updatedRecords));
  };

  // Λήψη όλων των χρηστών
  const getAllUsers = (): User[] => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users.map((u: any) => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση χρηστών:", error);
      return [];
    }
  };
  
  // Προσομοίωση σύνδεσης
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Ελέγχουμε αν υπάρχει ο χρήστης στο localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);

      if (foundUser && foundUser.password === password) {
        // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Βεβαιωνόμαστε ότι υπάρχει ρόλος, αν όχι προσθέτουμε τον προεπιλεγμένο
        if (!userWithoutPassword.role) {
          userWithoutPassword.role = "student";
          
          // Ενημέρωση του χρήστη στο localStorage με το ρόλο
          const updatedUsers = users.map((u: any) => 
            u.id === foundUser.id ? { ...u, role: "student" } : u
          );
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        }
        
        console.log("Σύνδεση επιτυχής. Ρόλος χρήστη:", userWithoutPassword.role);
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        
        // Καταγραφή της σύνδεσης
        addLoginRecord(userWithoutPassword);
        
        toast.success("Επιτυχής σύνδεση", {
          description: "Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Σφάλμα σύνδεσης:", error);
      return false;
    }
  };

  // Προσομοίωση εγγραφής
  const register = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    role: UserRole = "student"
  ): Promise<boolean> => {
    try {
      // Ελέγχουμε αν υπάρχει ήδη ο χρήστης
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        toast.error("Σφάλμα εγγραφής", {
          description: "Το email χρησιμοποιείται ήδη. Παρακαλώ χρησιμοποιήστε άλλο email.",
        });
        return false;
      }

      // Δημιουργία νέου χρήστη
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        role,
      };

      console.log("Δημιουργία νέου χρήστη με ρόλο:", role);

      // Αποθήκευση στη λίστα χρηστών
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      // Καταγραφή της σύνδεσης
      addLoginRecord(userWithoutPassword);
      
      toast.success("Επιτυχής εγγραφή", {
        description: "Ο λογαριασμός σας δημιουργήθηκε με επιτυχία και είστε συνδεδεμένοι.",
      });

      return true;
    } catch (error) {
      console.error("Σφάλμα εγγραφής:", error);
      toast.error("Σφάλμα εγγραφής", {
        description: "Παρουσιάστηκε σφάλμα κατά την εγγραφή. Παρακαλώ προσπαθήστε ξανά.",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.info("Αποσύνδεση", {
      description: "Έχετε αποσυνδεθεί επιτυχώς.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isTeacher,
        loginRecords,
        login,
        register,
        logout,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
