
import { User, RegisterData, LoginRecord } from "@/types/auth";
import { makeUserTeacherAndAdmin } from "./adminService";

// User login
export const loginUser = async (
  email: string, 
  password: string,
  loginRecords: LoginRecord[],
  setLoginRecords: (records: LoginRecord[]) => void
): Promise<User | null> => {
  // Ειδική περίπτωση για τον κύριο διαχειριστή
  if (email === "liofisdimitris@gmail.com" && password === "Skatadi21!") {
    console.log("Απευθείας σύνδεση για τον κύριο διαχειριστή");
    
    // Βεβαιωνόμαστε ότι υπάρχει ο χρήστης με τα σωστά δικαιώματα
    await makeUserTeacherAndAdmin(email);
    
    const adminUser: User = {
      id: "admin-special-id",
      firstName: "Διαχειριστής",
      lastName: "Συστήματος",
      email: email,
      role: "admin",
      roles: ["admin", "teacher"]
    };
    
    localStorage.setItem("user", JSON.stringify(adminUser));
    
    // Καταγραφή της σύνδεσης
    const loginRecord: LoginRecord = {
      userId: adminUser.id,
      userName: `${adminUser.firstName} ${adminUser.lastName}`,
      email: adminUser.email,
      role: adminUser.role,
      timestamp: Date.now()
    };
    
    const updatedRecords = [...loginRecords, loginRecord];
    setLoginRecords(updatedRecords);
    localStorage.setItem("loginRecords", JSON.stringify(updatedRecords));
    
    return adminUser;
  }
  
  // Κανονική διαδικασία σύνδεσης
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) return null;

  const users = JSON.parse(storedUsers);
  const user = users.find((u: User & { password?: string }) => u.email === email && u.password === password);

  if (user) {
    // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    // Βεβαιωνόμαστε ότι έχει την ιδιότητα roles αν δεν την έχει
    if (!userWithoutPassword.roles) {
      userWithoutPassword.roles = [userWithoutPassword.role];
    }
    
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    // Καταγραφή της σύνδεσης με περισσότερες λεπτομέρειες
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
    
    return userWithoutPassword;
  }

  return null;
};

// User registration
export const registerUser = async (userData: RegisterData): Promise<boolean> => {
  try {
    // Ελέγχουμε αν το email υπάρχει ήδη
    const storedUsers = localStorage.getItem("users");
    let users = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const existingUser = users.find((u: User) => u.email === userData.email);
      if (existingUser) {
        return false; // Το email υπάρχει ήδη
      }
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
      roles: [role]
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};
