import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Book, BookPlus, School, PlusCircle, Users, Shield, Wrench } from "lucide-react";

const UserMenu = () => {
  const { user, isAuthenticated, isAdmin, isTeacher, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="outline">Σύνδεση</Button>
        </Link>
        <Link to="/register" className="hidden sm:block">
          <Button>Εγγραφή</Button>
        </Link>
        <Link to="/it-support-login" className="hidden sm:block">
          <Button variant="outline" className="border-blue-400 text-blue-500 hover:bg-blue-50">
            Login IT Support
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = () => {
    if (!user) return "??";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.role === "admin" ? "Διαχειριστής" : 
               user?.role === "teacher" ? "Εκπαιδευτικός" : "Μαθητής"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Το προφίλ μου</span>
          </Link>
        </DropdownMenuItem>

        {/* Μενού για εκπαιδευτικούς */}
        {isTeacher && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/teacher-dashboard" className="cursor-pointer flex w-full items-center">
                <School className="mr-2 h-4 w-4" />
                <span>Πίνακας Εκπαιδευτικού</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/add-content" className="cursor-pointer flex w-full items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Προσθήκη Υλικού</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Μενού για διαχειριστές */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Διαχείριση</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="cursor-pointer flex w-full items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Διαχείριση Χρηστών</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/logins" className="cursor-pointer flex w-full items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Καταγραφές Συνδέσεων</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/it-support" className="cursor-pointer flex w-full items-center">
                <Wrench className="mr-2 h-4 w-4" />
                <span>IT Support</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Αποσύνδεση</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
