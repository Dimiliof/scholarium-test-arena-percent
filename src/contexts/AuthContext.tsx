
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Ορισμός του τύπου χρήστη
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

// Ορισμός του τύπου για το context
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Δημιουργία context με αρχικές τιμές
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Hook για εύκολη χρήση του context
export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Έλεγχος για υπάρχουσα σύνδεση κατά την αρχικοποίηση
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Προσομοίωση σύνδεσης
  const login = async (email: string, password: string): Promise<boolean> => {
    // Ελέγχουμε αν υπάρχει ο χρήστης στο localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: any) => u.email === email);

    if (foundUser && foundUser.password === password) {
      // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  // Προσομοίωση εγγραφής
  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      // Ελέγχουμε αν υπάρχει ήδη ο χρήστης
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        return false;
      }

      // Δημιουργία νέου χρήστη
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
      };

      // Αποθήκευση στη λίστα χρηστών
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
