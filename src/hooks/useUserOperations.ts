
import { User, RegisterData, LoginRecord } from "../types/auth";
import { 
  getAllUsersFromLocalStorage, 
  saveUsersToLocalStorage, 
  saveUserToLocalStorage 
} from "../utils/authUtils";

// Hook για λειτουργίες χρήστη
export const useUserOperations = () => {
  // Σύνδεση χρήστη
  const login = async (email: string, password: string, loginRecords: LoginRecord[], setLoginRecords: React.Dispatch<React.SetStateAction<LoginRecord[]>>) => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) return false;

    const users = JSON.parse(storedUsers);
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
      // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη στο state
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      saveUserToLocalStorage(userWithoutPassword);
      
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

  // Εγγραφή νέου χρήστη
  const register = async (userData: RegisterData) => {
    try {
      // Ελέγχουμε αν το email υπάρχει ήδη
      const users = getAllUsersFromLocalStorage();
      
      const existingUser = users.find((u: User) => u.email === userData.email);
      if (existingUser) {
        return false; // Το email υπάρχει ήδη
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
      saveUsersToLocalStorage(users);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Ενημέρωση προφίλ χρήστη
  const updateUserProfile = async (updatedUser: User) => {
    try {
      // Διατηρούμε τους άλλους χρήστες και επικαιροποιούμε μόνο τον τρέχοντα
      const users = getAllUsersFromLocalStorage();
      const updatedUsers = users.map((u: User) => {
        if (u.id === updatedUser.id) {
          // Preserve the password if it exists in the original user
          const password = u.password;
          return { ...updatedUser, password };
        }
        return u;
      });
      
      saveUsersToLocalStorage(updatedUsers);
      
      // Ενημερώνουμε τον τρέχοντα χρήστη στο localStorage
      // We don't want to save the password in the current user state
      const userWithoutPassword = { ...updatedUser };
      delete userWithoutPassword.password;
      saveUserToLocalStorage(userWithoutPassword);
      
      console.log("Το προφίλ ενημερώθηκε με επιτυχία:", updatedUser);
      
      return true;
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του προφίλ:", error);
      return false;
    }
  };

  // Αλλαγή κωδικού πρόσβασης
  const changePassword = async (currentPassword: string, newPassword: string, user: User | null) => {
    if (!user) return false;
    
    try {
      const users = getAllUsersFromLocalStorage();
      const userIndex = users.findIndex((u: User) => 
        u.id === user.id && u.password === currentPassword
      );
      
      if (userIndex === -1) {
        console.error("Λάθος τρέχων κωδικός");
        return false;
      }
      
      // Ενημερώνουμε τον κωδικό
      users[userIndex].password = newPassword;
      saveUsersToLocalStorage(users);
      
      console.log("Ο κωδικός άλλαξε με επιτυχία");
      
      return true;
    } catch (error) {
      console.error("Σφάλμα κατά την αλλαγή κωδικού:", error);
      return false;
    }
  };

  // Λήψη όλων των χρηστών
  const getAllUsers = () => {
    return getAllUsersFromLocalStorage();
  };

  return {
    login,
    register,
    updateUserProfile,
    changePassword,
    getAllUsers
  };
};
