
import { User, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useToast } from "@/hooks/use-toast";

export default function UserMenu() {
  const { user, logout, isAuthenticated, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Αποσύνδεση",
      description: "Αποσυνδεθήκατε επιτυχώς από το σύστημα."
    });
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register-type");
  };

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
              data-dropdown-toggle="userDropdown"
            >
              <UserCircle className="h-6 w-6" />
              <span className="hidden md:inline">
                {user?.firstName || "Χρήστης"}
              </span>
            </Button>
            <div
              id="userDropdown"
              className="dropdown-menu hidden absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 min-w-[200px] z-50"
            >
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
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
