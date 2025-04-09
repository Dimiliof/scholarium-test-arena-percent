
import { Link } from "react-router-dom";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, Settings, BookOpen } from "lucide-react";

const ProfileMenuItems = () => {
  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/profile" className="cursor-pointer flex w-full items-center">
          <User className="mr-2 h-4 w-4" />
          <span>Το προφίλ μου</span>
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuItem asChild>
        <Link to="/edit-profile" className="cursor-pointer flex w-full items-center">
          <Settings className="mr-2 h-4 w-4" />
          <span>Επεξεργασία προφίλ</span>
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem asChild>
        <Link to="/resources" className="cursor-pointer flex w-full items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Εκπαιδευτικό Υλικό</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
};

export default ProfileMenuItems;
