
import { useState, useCallback } from "react";
import { User } from "@/types/auth";
import { makeUserTeacherAndAdmin as makeUserTeacherAndAdminService } from "@/services/adminService";

export const useAdminFunctions = (setUser: (user: User | null) => void) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Διόρθωση της μεθόδου fixAdminEmail για να παρέχει και ρόλο εκπαιδευτικού
  const fixAdminEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Καλούμε απευθείας τη νέα μέθοδο για να ορίσουμε και τους δύο ρόλους
      return await makeUserTeacherAndAdmin(email);
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
      return false;
    }
  }, []);

  // Μέθοδος για ορισμό χρήστη ως διαχειριστή και εκπαιδευτικό ταυτόχρονα
  const makeUserTeacherAndAdmin = useCallback(async (email: string): Promise<boolean> => {
    try {
      const success = await makeUserTeacherAndAdminService(email);
      
      // Αν ο συνδεδεμένος χρήστης είναι αυτός που ενημερώνουμε, ενημερώνουμε και το user state
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          const updatedUser: User = { 
            ...user, 
            role: "admin" as const,
            roles: ["admin", "teacher"]
          };
          setUser(updatedUser);
          setIsAdmin(true);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης με διπλό ρόλο");
        }
      }
      
      return success;
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
      return false;
    }
  }, [setUser]);

  return {
    isAdmin,
    setIsAdmin,
    fixAdminEmail,
    makeUserTeacherAndAdmin
  };
};
