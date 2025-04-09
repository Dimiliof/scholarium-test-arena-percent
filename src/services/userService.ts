
import { User } from "@/types/auth";

// Get all users
export const getAllUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) return [];
  
  return JSON.parse(storedUsers);
};

// Update user profile
export const updateProfile = async (updatedUser: User): Promise<boolean> => {
  try {
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
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    console.log("Το προφίλ ενημερώθηκε με επιτυχία:", updatedUser);
    
    return true;
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση του προφίλ:", error);
    return false;
  }
};

// Change user password
export const changeUserPassword = async (user: User, currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
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
