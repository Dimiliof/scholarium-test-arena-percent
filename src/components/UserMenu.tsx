
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
import { Badge } from "@/components/ui/badge";
import { User, LogOut } from "lucide-react";
import StudentMenuItems from "./user-menu/StudentMenuItems";
import TeacherMenuItems from "./user-menu/TeacherMenuItems";
import AdminMenuItems from "./user-menu/AdminMenuItems";
import ProfileMenuItems from "./user-menu/ProfileMenuItems";

const UserMenu = () => {
  const { user, isAuthenticated, isAdmin, isTeacher, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="outline">Σύνδεση</Button>
        </Link>
        <Link to="/register-type" className="hidden sm:block">
          <Button>Εγγραφή</Button>
        </Link>
        <Link to="/it-support-login" className="hidden sm:block">
          <Button variant="outline" className="border-blue-400 text-blue-500 hover:bg-blue-50">
            IT Support
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = () => {
    if (!user) return "??";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  const getRoleBadge = () => {
    if (!user) return null;
    
    if (user.roles && user.roles.length > 1) {
      return (
        <Badge 
          className="bg-purple-500 text-white text-xs absolute -bottom-1 -right-1 px-1 rounded-sm"
        >
          {user.roles.length} ρόλοι
        </Badge>
      );
    }
    
    let color = "";
    let label = "";
    
    switch (user.role) {
      case "admin":
        color = "bg-red-500";
        label = "Διαχειριστής";
        break;
      case "teacher":
        color = "bg-blue-500";
        label = "Εκπαιδευτικός";
        break;
      default:
        color = "bg-green-500";
        label = "Μαθητής";
    }
    
    return (
      <Badge 
        className={`${color} text-white text-xs absolute -bottom-1 -right-1 px-1 rounded-sm`}
      >
        {label}
      </Badge>
    );
  };
  
  const getRoles = () => {
    if (!user) return "Άγνωστος ρόλος";
    
    if (user.roles && user.roles.length > 0) {
      return user.roles.map(role => {
        switch(role) {
          case "admin": return "Διαχειριστής";
          case "teacher": return "Εκπαιδευτικός";
          case "student": return "Μαθητής";
          default: return role;
        }
      }).join(", ");
    }
    
    return user.role === "admin" ? "Διαχειριστής" : 
           user.role === "teacher" ? "Εκπαιδευτικός" : "Μαθητής";
  };

  const isStudent = isAuthenticated && !isAdmin && !isTeacher;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.firstName} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          {getRoleBadge()}
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
              {getRoles()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ProfileMenuItems />

        {isStudent && <StudentMenuItems />}
        {isTeacher && <TeacherMenuItems />}
        {isAdmin && <AdminMenuItems />}

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
