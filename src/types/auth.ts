
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: "admin" | "teacher" | "student";
  roles?: string[];
  school?: string;     // Added for teachers
  classYear?: string;  // Added for students
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "teacher" | "student";
  school?: string;     // Added for teachers
  classYear?: string;  // Added for students
  termsAccepted?: boolean; // Added for registration form
};

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
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (user: User) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getAllUsers: () => User[];
  loginRecords: LoginRecord[];
  fixAdminEmail: (email: string) => Promise<boolean>;
  makeUserTeacherAndAdmin: (email: string) => Promise<boolean>;
  canViewAllContent: boolean;
};
