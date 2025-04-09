
import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { makeUserTeacherAndAdmin as makeUserTeacherAndAdminService } from "@/services/adminService";

export const useRoleManagement = (user: User | null) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

  // Update roles when user changes
  useEffect(() => {
    if (user) {
      // Βελτιωμένος έλεγχος ρόλων για συνέπεια
      const isUserAdmin = user.role === "admin" || 
                        (user.roles && user.roles.includes("admin")) ||
                        user.email === "liofisdimitris@gmail.com";
                        
      const isUserTeacher = user.role === "teacher" || 
                          (user.roles && user.roles.includes("teacher")) ||
                          user.email === "liofisdimitris@gmail.com";
      
      setIsAdmin(isUserAdmin);
      setIsTeacher(isUserTeacher);
      
      console.log("Role Management Updated - Admin:", isUserAdmin, "Teacher:", isUserTeacher);
    } else {
      setIsAdmin(false);
      setIsTeacher(false);
    }
  }, [user]);

  // Fix admin email functionality
  const fixAdminEmail = async (email: string): Promise<boolean> => {
    try {
      return await makeUserTeacherAndAdminService(email);
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
      return false;
    }
  };

  // Make user teacher and admin functionality
  const makeUserTeacherAndAdmin = async (email: string): Promise<boolean> => {
    try {
      const success = await makeUserTeacherAndAdminService(email);
      
      // If the current user is the one being updated, update local storage
      if (user?.email === email) {
        const updatedUser: User = { 
          ...user, 
          role: "admin" as const,
          roles: ["admin", "teacher"]
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsAdmin(true);
        setIsTeacher(true);
      }
      
      return success;
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
      return false;
    }
  };

  return {
    isAdmin,
    isTeacher,
    fixAdminEmail,
    makeUserTeacherAndAdmin
  };
};
