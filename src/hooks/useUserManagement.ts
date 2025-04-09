
import { useState, useCallback } from "react";
import { User } from "@/types/auth";
import { 
  updateProfile as updateProfileService,
  changeUserPassword as changeUserPasswordService
} from "@/services/userService";

export const useUserManagement = () => {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

  // Ενημέρωση προφίλ χρήστη
  const updateUserProfile = useCallback(async (updatedUser: User): Promise<boolean> => {
    return await updateProfileService(updatedUser);
  }, []);
  
  // Αλλαγή κωδικού πρόσβασης
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return false;
    return await changeUserPasswordService(user, currentPassword, newPassword);
  }, []);

  return {
    isTeacher,
    setIsTeacher,
    updateUserProfile,
    changePassword
  };
};
