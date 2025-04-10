
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Settings, Trash2 } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  gradeLevel: string;
  studentsCount: number;
  createdAt: string;
}

interface ClassroomTableProps {
  classrooms: ClassData[];
  gradeLevel: string;
  onDeleteClass: (classId: string) => void;
}

const ClassroomTable: React.FC<ClassroomTableProps> = ({ 
  classrooms, 
  gradeLevel,
  onDeleteClass
}) => {
  const navigate = useNavigate();
  const filteredClassrooms = classrooms.filter(c => c.gradeLevel === gradeLevel);
  
  if (filteredClassrooms.length === 0) {
    return (
      <Alert>
        <AlertTitle>Δεν υπάρχουν τάξεις</AlertTitle>
        <AlertDescription>
          Δεν έχετε δημιουργήσει ακόμα τάξεις για {gradeLevel}.
        </AlertDescription>
      </Alert>
    );
  }
  
  const handleManageClass = (classId: string) => {
    navigate(`/classroom/${classId}`);
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Όνομα Τάξης</TableHead>
          <TableHead>Πλήθος Μαθητών</TableHead>
          <TableHead>Ημερομηνία Δημιουργίας</TableHead>
          <TableHead>Ενέργειες</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredClassrooms.map(classroom => (
          <TableRow key={classroom.id}>
            <TableCell>{classroom.name}</TableCell>
            <TableCell>{classroom.studentsCount} μαθητές</TableCell>
            <TableCell>{new Date(classroom.createdAt).toLocaleDateString('el-GR')}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleManageClass(classroom.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Διαχείριση
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDeleteClass(classroom.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Διαγραφή
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassroomTable;
