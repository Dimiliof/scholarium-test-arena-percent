
// Τύπος δεδομένων για την εγγραφή
export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  school?: string;
  classYear?: string;
  termsAccepted: boolean;
  role?: "teacher" | "student";
  roles?: string[]; // Προσθήκη υποστήριξης για πολλαπλούς ρόλους
};

// Τύπος χρήστη
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "teacher" | "student";
  roles?: string[]; // Προσθήκη πεδίου για πολλαπλούς ρόλους
  profileImage?: string | null;
  password?: string; // Add password property for internal use
};

// Τύπος καταγραφής σύνδεσης
export type LoginRecord = {
  userId: string;
  userName: string;
  email: string;
  role: string;
  timestamp: number;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getAllUsers: () => User[];
  loginRecords: LoginRecord[];
  fixAdminEmail: (email: string) => Promise<boolean>;
  makeUserTeacherAndAdmin: (email: string) => Promise<boolean>;
};
