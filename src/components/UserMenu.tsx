
import React, { useEffect, useRef } from "react";
import { User, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

export default function UserMenu() {
  const { user, logout, isAuthenticated, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    
    // Διπλή ειδοποίηση για επιβεβαίωση αποσύνδεσης στον χρήστη
    uiToast({
      title: "Αποσύνδεση",
      description: "Αποσυνδεθήκατε επιτυχώς από το σύστημα."
    });
    
    toast.success("Αποσυνδεθήκατε επιτυχώς");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register-type");
  };

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("hidden");
    }
  };

  // Κλείνουμε το dropdown όταν κάνουμε κλικ έξω από αυτό
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && buttonRef.current && 
          !dropdownRef.current.contains(e.target as Node) && 
          !buttonRef.current.contains(e.target as Node)) {
        dropdownRef.current.classList.add("hidden");
      }
    };
    
    document.addEventListener("click", closeDropdown);
    
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <>
          {/* Κουμπί ειδοποιήσεων */}
          <NotificationBell />
          
          <div className="dropdown relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
              onClick={toggleDropdown}
              ref={buttonRef}
            >
              <UserCircle className="h-6 w-6" />
              <span className="hidden md:inline">
                {user?.firstName || "ΔΗΜΗΤΡΗΣ"}
              </span>
            </Button>
            <div
              ref={dropdownRef}
              className="dropdown-menu hidden absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 min-w-[200px] z-50"
            >
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
                <div className="flex gap-1 mt-1">
                  {isAdmin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Διαχειριστής
                    </span>
                  )}
                  {isTeacher && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Εκπαιδευτικός
                    </span>
                  )}
                </div>
              </div>
              <ul>
                <li>
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Το προφίλ μου
                  </a>
                </li>
                {isTeacher && (
                  <>
                    <li>
                      <a
                        href="/teacher-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Πίνακας Ελέγχου
                      </a>
                    </li>
                    <li>
                      <a
                        href="/teacher/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Αποστολή Ειδοποιήσεων
                      </a>
                    </li>
                  </>
                )}
                {isAdmin && (
                  <li>
                    <a
                      href="/admin/users"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Διαχείριση
                    </a>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Αποσύνδεση
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLogin}>
            Σύνδεση
          </Button>
          <Button size="sm" onClick={handleRegister}>
            Εγγραφή
          </Button>
        </div>
      )}
    </div>
  );
}
