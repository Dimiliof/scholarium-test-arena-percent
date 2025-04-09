
import { User, RegisterData, LoginRecord } from "@/types/auth";

// Διόρθωση του email του διαχειριστή κατά την εκκίνηση
export const fixAdminEmailOnStartup = (): void => {
  const adminEmail = "liofisdimitris@gmail.com";
  const storedUsers = localStorage.getItem("users");
  
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    let needsUpdate = false;
    
    const updatedUsers = users.map((u: User) => {
      if (u.email === adminEmail) {
        needsUpdate = true;
        console.log(`Διόρθωση ρόλου για τον διαχειριστή ${adminEmail} από ${u.role} σε admin`);
        return { ...u, role: "admin" as const };
      }
      return u;
    });
    
    if (needsUpdate) {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      console.log("Ενημερώθηκε η λίστα χρηστών για τον διαχειριστή");
      
      // Αν ο συνδεδεμένος χρήστης είναι ο διαχειριστής, ενημερώνουμε και αυτόν
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.email === adminEmail) {
          parsedUser.role = "admin";
          localStorage.setItem("user", JSON.stringify(parsedUser));
          console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης-διαχειριστής");
        }
      }
    } else {
      // Αν δεν υπάρχει ο διαχειριστής, τον δημιουργούμε
      const adminExists = users.some((u: User) => u.email === adminEmail);
      if (!adminExists) {
        console.log("Ο διαχειριστής δεν υπάρχει, τον δημιουργούμε");
        const newAdmin = {
          id: Math.random().toString(36).substring(2, 15),
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: adminEmail,
          password: "admin12345",
          role: "admin" as const,
        };
        users.push(newAdmin);
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Δημιουργήθηκε ο διαχειριστής:", newAdmin);
      }
    }
  } else {
    // Αν δεν υπάρχουν χρήστες, δημιουργούμε τον διαχειριστή
    const newAdmin = {
      id: Math.random().toString(36).substring(2, 15),
      firstName: "Διαχειριστής",
      lastName: "Συστήματος",
      email: adminEmail,
      password: "admin12345",
      role: "admin" as const,
    };
    localStorage.setItem("users", JSON.stringify([newAdmin]));
    console.log("Δημιουργήθηκε αρχικός διαχειριστής:", newAdmin);
  }
};

// Μέθοδος για ορισμό χρήστη ως διαχειριστή και εκπαιδευτικό ταυτόχρονα
export const makeUserTeacherAndAdmin = async (email: string): Promise<boolean> => {
  try {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      // Αν δεν υπάρχουν χρήστες, δημιουργούμε νέο με διπλό ρόλο
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        firstName: "Διαχειριστής",
        lastName: "Εκπαιδευτικός",
        email: email,
        password: "admin12345",
        role: "admin" as const,
        roles: ["admin", "teacher"],
      };
      localStorage.setItem("users", JSON.stringify([newUser]));
      console.log("Δημιουργήθηκε χρήστης με διπλό ρόλο:", newUser);
      return true;
    }
    
    const users = JSON.parse(storedUsers);
    let userFound = false;
    
    const updatedUsers = users.map((u: User & { password?: string }) => {
      if (u.email === email) {
        userFound = true;
        console.log(`Ο χρήστης ${email} βρέθηκε. Ενημέρωση σε διαχειριστή και εκπαιδευτικό.`);
        return { 
          ...u, 
          role: "admin" as const, 
          roles: ["admin", "teacher"]
        };
      }
      return u;
    });
    
    if (!userFound) {
      // Αν δεν υπάρχει ο χρήστης, τον δημιουργούμε
      console.log(`Ο χρήστης ${email} δεν βρέθηκε. Δημιουργία νέου με διπλό ρόλο.`);
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        firstName: "Διαχειριστής",
        lastName: "Εκπαιδευτικός",
        email: email,
        password: "admin12345",
        role: "admin" as const,
        roles: ["admin", "teacher"],
      };
      updatedUsers.push(newUser);
    }
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    console.log("Η λίστα χρηστών ενημερώθηκε επιτυχώς");
    
    return true;
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
    return false;
  }
};

// Σύνδεση χρήστη
export const loginUser = async (
  email: string, 
  password: string,
  loginRecords: LoginRecord[],
  setLoginRecords: (records: LoginRecord[]) => void
): Promise<User | null> => {
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) return null;

  const users = JSON.parse(storedUsers);
  const user = users.find((u: User & { password?: string }) => u.email === email && u.password === password);

  if (user) {
    // Αφαιρούμε τον κωδικό πριν αποθηκεύσουμε τον χρήστη
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
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
    
    return userWithoutPassword;
  }

  return null;
};

// Εγγραφή χρήστη
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
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};

// Ενημέρωση προφίλ χρήστη
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

// Αλλαγή κωδικού πρόσβασης
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

// Λήψη όλων των χρηστών
export const getAllUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) return [];
  
  return JSON.parse(storedUsers);
};
