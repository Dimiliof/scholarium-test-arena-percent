
import { Link } from "react-router-dom";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { BookOpen, GraduationCap, Award, FileText } from "lucide-react";

const StudentMenuItems = () => {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs">Μαθήματα</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link to="/student/courses" className="cursor-pointer flex w-full items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Τα Μαθήματά μου</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/student/enroll" className="cursor-pointer flex w-full items-center">
          <GraduationCap className="mr-2 h-4 w-4" />
          <span>Εγγραφή σε Μάθημα</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/resources" className="cursor-pointer flex w-full items-center">
          <FileText className="mr-2 h-4 w-4" />
          <span>Εκπαιδευτικό Υλικό</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/student/results" className="cursor-pointer flex w-full items-center">
          <Award className="mr-2 h-4 w-4" />
          <span>Τα Αποτελέσματά μου</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
};

export default StudentMenuItems;
