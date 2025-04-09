
import { useState, useCallback } from "react";
import { User, LoginRecord } from "@/types/auth";
import { 
  updateProfile as updateProfileService,
  changeUserPassword as changeUserPasswordService
} from "@/services/authService";

export const useUserManagement = () => {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

  // Ενημέρωση προφίλ χρήστη
  const updateUserProfile = useCallback(async (updatedUser: User): Promise<boolean> => {
    return await updateProfileService(updatedUser);
  }, []);
  
  // Αλλαγή κωδικού πρόσβασης
  const changePassword = useCallback(async (user: User | null, currentPassword: string, newPassword: string): Promise<boolean> => {
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
