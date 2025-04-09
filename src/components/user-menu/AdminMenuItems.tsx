
import { Link } from "react-router-dom";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Users, Shield, Wrench } from "lucide-react";

const AdminMenuItems = () => {
  return (
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
  );
};

export default AdminMenuItems;
