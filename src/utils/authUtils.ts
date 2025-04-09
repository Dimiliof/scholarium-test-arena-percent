
import { User } from "../types/auth";

// Βοηθητική συνάρτηση για να ελέγξουμε αν ένας χρήστης είναι διαχειριστής
export const checkIsAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === "admin" || (user.roles && user.roles.includes("admin"));
};

// Βοηθητική συνάρτηση για να ελέγξουμε αν ένας χρήστης είναι εκπαιδευτικός
export const checkIsTeacher = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === "teacher" || (user.roles && user.roles.includes("teacher"));
};

// Βοηθητική συνάρτηση για την αποθήκευση ενός χρήστη στο localStorage
export const saveUserToLocalStorage = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Βοηθητική συνάρτηση για την ανάκτηση ενός χρήστη από το localStorage
export const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  return JSON.parse(storedUser);
};

// Βοηθητική συνάρτηση για την ανάκτηση όλων των χρηστών από το localStorage
export const getAllUsersFromLocalStorage = (): User[] => {
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) return [];
  return JSON.parse(storedUsers);
};

// Βοηθητική συνάρτηση για την αποθήκευση των χρηστών στο localStorage
export const saveUsersToLocalStorage = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};
