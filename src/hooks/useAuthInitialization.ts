
import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { fixAdminEmailOnStartup, makeUserTeacherAndAdmin } from "@/services/adminService";

export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize user state from localStorage on mount
  useEffect(() => {
    // Fix admin email on startup
    try {
      fixAdminEmailOnStartup();
    } catch (error) {
      console.error("Σφάλμα κατά την επιδιόρθωση email διαχειριστή:", error);
    }
    
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Ensure the main admin account always has all permissions
        if (parsedUser.email === "liofisdimitris@gmail.com" && 
            (!parsedUser.roles || !parsedUser.roles.includes("admin"))) {
          console.log("Αυτόματη προσθήκη δικαιωμάτων διαχειριστή για τον κύριο λογαριασμό");
          
          // Create updated user with correct permissions
          const updatedUser = {
            ...parsedUser,
            role: "admin",
            roles: ["admin", "teacher"]
          };
          
          // Update user state
          setUser(updatedUser);
          
          // Save to localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          // Update user in the database
          try {
            makeUserTeacherAndAdmin(parsedUser.email);
          } catch (error) {
            console.error("Σφάλμα κατά την ενημέρωση ρόλων:", error);
          }
        }
      } catch (error) {
        console.error("Σφάλμα κατά την ανάλυση του αποθηκευμένου χρήστη:", error);
        // Clear localStorage and state on error
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  return { 
    user, 
    setUser,
    isAuthenticated, 
    setIsAuthenticated 
  };
};
