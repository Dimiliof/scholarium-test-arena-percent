
import { useState, useEffect } from "react";
import { User, LoginRecord } from "@/types/auth";
import { loginUser, registerUser } from "@/services/authenticationService";
import { toast } from "sonner";

export const useAuthOperations = () => {
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);

  // Load login records from localStorage on initial render
  useEffect(() => {
    const storedRecords = localStorage.getItem("loginRecords");
    if (storedRecords) {
      try {
        setLoginRecords(JSON.parse(storedRecords));
      } catch (error) {
        console.error("Σφάλμα κατά την ανάλυση των καταγραφών σύνδεσης:", error);
        localStorage.removeItem("loginRecords");
      }
    }
  }, []);

  // User login functionality
  const login = async (email: string, password: string): Promise<User | null> => {
    // Ειδική περίπτωση για τον κύριο διαχειριστή
    if (email === "liofisdimitris@gmail.com" && password === "Skatadi21!") {
      console.log("Απευθείας σύνδεση για τον κύριο διαχειριστή");
      
      // Δημιουργία του αντικειμένου χρήστη
      const adminUser: User = {
        id: "admin-special-id",
        firstName: "Διαχειριστής",
        lastName: "Συστήματος",
        email: email,
        role: "admin",
        roles: ["admin", "teacher"]
      };
      
      // Αποθήκευση στο localStorage
      localStorage.setItem("user", JSON.stringify(adminUser));
      
      // Καταγραφή σύνδεσης
      const loginRecord: LoginRecord = {
        userId: adminUser.id,
        userName: `${adminUser.firstName} ${adminUser.lastName}`,
        email: adminUser.email,
        role: adminUser.role,
        timestamp: Date.now()
      };
      
      // Ενημέρωση καταγραφών
      const updatedRecords = [...loginRecords, loginRecord];
      setLoginRecords(updatedRecords);
      localStorage.setItem("loginRecords", JSON.stringify(updatedRecords));
      
      return adminUser;
    }
    
    // Κανονική ροή σύνδεσης για άλλους χρήστες
    return await loginUser(email, password, loginRecords, setLoginRecords);
  };

  // User registration functionality
  const register = async (userData: any): Promise<boolean> => {
    return await registerUser(userData);
  };

  // User logout functionality
  const logout = () => {
    localStorage.removeItem("user");
    toast.success("Αποσυνδεθήκατε επιτυχώς");
  };

  return {
    login,
    register,
    logout,
    loginRecords
  };
};
