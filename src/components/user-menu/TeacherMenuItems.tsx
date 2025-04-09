
import { Link } from "react-router-dom";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { School, PlusCircle, FileText } from "lucide-react";

const TeacherMenuItems = () => {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs">Διδασκαλία</DropdownMenuLabel>
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
      <DropdownMenuItem asChild>
        <Link to="/resources" className="cursor-pointer flex w-full items-center">
          <FileText className="mr-2 h-4 w-4" />
          <span>Υλικό Μαθημάτων</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
};

export default TeacherMenuItems;
