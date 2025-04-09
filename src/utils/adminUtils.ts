
import { User } from "../types/auth";
import { getAllUsersFromLocalStorage, saveUsersToLocalStorage, saveUserToLocalStorage } from "./authUtils";

// Διόρθωση του email του διαχειριστή κατά την εκκίνηση
export const fixAdminEmailOnStartup = (): void => {
  const adminEmail = "liofisdimitris@gmail.com";
  console.log("Έλεγχος διαχειριστή κατά την εκκίνηση:", adminEmail);
  
  const storedUsers = localStorage.getItem("users");
  
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    let needsUpdate = false;
    
    const updatedUsers = users.map((u: User) => {
      if (u.email === adminEmail) {
        needsUpdate = true;
        console.log(`Διόρθωση ρόλου για τον διαχειριστή ${adminEmail} από ${u.role} σε admin`);
        return { 
          ...u, 
          role: "admin" as const,
          roles: ["admin", "teacher"],
          password: "Skatadi21!" // Ενημέρωση του κωδικού
        };
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
          parsedUser.roles = ["admin", "teacher"];
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
          id: "admin-special-id",
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: adminEmail,
          password: "Skatadi21!",
          role: "admin" as const,
          roles: ["admin", "teacher"]
        };
        users.push(newAdmin);
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Δημιουργήθηκε ο διαχειριστής:", newAdmin);
      }
    }
  } else {
    // Αν δεν υπάρχουν χρήστες, δημιουργούμε τον διαχειριστή
    const newAdmin = {
      id: "admin-special-id",
      firstName: "Διαχειριστής",
      lastName: "Συστήματος",
      email: adminEmail,
      password: "Skatadi21!",
      role: "admin" as const,
      roles: ["admin", "teacher"]
    };
    localStorage.setItem("users", JSON.stringify([newAdmin]));
    console.log("Δημιουργήθηκε αρχικός διαχειριστής:", newAdmin);
  }
};

// Μέθοδος για ορισμό χρήστη ως διαχειριστή και εκπαιδευτικό ταυτόχρονα
export const makeUserTeacherAndAdmin = async (email: string): Promise<boolean> => {
  try {
    console.log(`Προσπάθεια ορισμού χρήστη ως διαχειριστή και εκπαιδευτικό: ${email}`);
    const users = getAllUsersFromLocalStorage();
    let userFound = false;
    
    const updatedUsers = users.map((u: User & { password?: string }) => {
      if (u.email === email) {
        userFound = true;
        console.log(`Ο χρήστης ${email} βρέθηκε. Ενημέρωση σε διαχειριστή και εκπαιδευτικό.`);
        return { 
          ...u, 
          role: "admin" as const, 
          roles: ["admin", "teacher"],
          password: "Skatadi21!" // Εξασφαλίζουμε ότι ο κωδικός είναι σωστός
        };
      }
      return u;
    });
    
    if (!userFound) {
      // Αν δεν υπάρχει ο χρήστης, τον δημιουργούμε
      console.log(`Ο χρήστης ${email} δεν βρέθηκε. Δημιουργία νέου με διπλό ρόλο.`);
      const newUser = {
        id: "admin-special-id",
        firstName: "Διαχειριστής",
        lastName: "Συστήματος",
        email: email,
        password: "Skatadi21!",
        role: "admin" as const,
        roles: ["admin", "teacher"],
      };
      updatedUsers.push(newUser);
    }
    
    saveUsersToLocalStorage(updatedUsers);
    console.log("Η λίστα χρηστών ενημερώθηκε επιτυχώς");
    
    // Αν ο συνδεδεμένος χρήστης είναι αυτός που ενημερώνουμε, ενημερώνουμε και το user state
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.email === email) {
        const updatedUser = { 
          ...parsedUser, 
          role: "admin" as const,
          roles: ["admin", "teacher"]
        };
        saveUserToLocalStorage(updatedUser);
        console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης με διπλό ρόλο");
      }
    } else {
      // Αν δεν υπάρχει συνδεδεμένος χρήστης, δημιουργούμε έναν
      const newAdminUser = {
        id: "admin-special-id",
        firstName: "Διαχειριστής",
        lastName: "Συστήματος",
        email: email,
        role: "admin" as const,
        roles: ["admin", "teacher"]
      };
      saveUserToLocalStorage(newAdminUser);
      console.log("Δημιουργήθηκε νέος συνδεδεμένος χρήστης-διαχειριστής");
    }
    
    return true;
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
    return false;
  }
};

// Τροποποίηση της μεθόδου fixAdminEmail για να παρέχει και ρόλο εκπαιδευτικού
export const fixAdminEmail = async (email: string): Promise<boolean> => {
  try {
    console.log(`Προσπάθεια διόρθωσης email διαχειριστή: ${email}`);
    // Καλούμε απευθείας τη μέθοδο για να ορίσουμε και τους δύο ρόλους
    return await makeUserTeacherAndAdmin(email);
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
    return false;
  }
};
