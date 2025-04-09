
import { User } from "@/types/auth";

// Fix admin email on startup
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
        return { 
          ...u, 
          role: "admin" as const,
          roles: ["admin", "teacher"]
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
          id: Math.random().toString(36).substring(2, 15),
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: adminEmail,
          password: "admin12345",
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
      id: Math.random().toString(36).substring(2, 15),
      firstName: "Διαχειριστής",
      lastName: "Συστήματος",
      email: adminEmail,
      password: "admin12345",
      role: "admin" as const,
      roles: ["admin", "teacher"]
    };
    localStorage.setItem("users", JSON.stringify([newAdmin]));
    console.log("Δημιουργήθηκε αρχικός διαχειριστής:", newAdmin);
  }
};

// Method to set user as teacher and admin
export const makeUserTeacherAndAdmin = async (email: string): Promise<boolean> => {
  try {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      // Αν δεν υπάρχουν χρήστες, τον δημιουργούμε
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
      console.log("Δημιουργήθηκε νέος χρήστης με διπλό ρόλο:", newUser);
      
      // Ενημερώνουμε τον τρέχοντα συνδεδεμένο χρήστη αν είναι ο ίδιος
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.email === email) {
          parsedUser.role = "admin";
          parsedUser.roles = ["admin", "teacher"];
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
      }
      
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
    
    // Ενημερώνουμε τον τρέχοντα συνδεδεμένο χρήστη αν είναι ο ίδιος
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.email === email) {
        parsedUser.role = "admin";
        parsedUser.roles = ["admin", "teacher"];
        localStorage.setItem("user", JSON.stringify(parsedUser));
        console.log("Ενημερώθηκε ο συνδεδεμένος χρήστης με διπλό ρόλο");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Σφάλμα κατά την ενημέρωση του ρόλου:", error);
    return false;
  }
};
