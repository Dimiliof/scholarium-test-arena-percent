
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import ClassroomTable from './ClassroomTable';
import { ClassData } from '@/hooks/useTeacherClassrooms';
import { PlusCircle } from 'lucide-react';
import GradeLevelSelect from '../resources/form/GradeLevelSelect';

interface ClassesTabProps {
  classrooms: ClassData[];
  setClassrooms: React.Dispatch<React.SetStateAction<ClassData[]>>;
  createClassroom: (name: string, gradeLevel: string) => boolean;
  deleteClassroom: (classId: string) => boolean;
}

const ClassesTab: React.FC<ClassesTabProps> = ({ 
  classrooms, 
  setClassrooms,
  createClassroom,
  deleteClassroom
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Α Γυμνασίου');

  const handleCreateClass = () => {
    if (createClassroom(newClassName, newClassGrade)) {
      setNewClassName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Οι τάξεις μου</CardTitle>
        <CardDescription>
          Διαχειριστείτε τις ηλεκτρονικές τάξεις και τους μαθητές σας.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Φόρμα δημιουργίας νέας τάξης */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Δημιουργία Νέας Τάξης</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Όνομα Τάξης</label>
                <input
                  type="text"
                  placeholder="π.χ. Τμήμα Α1"
                  className="w-full p-2 border rounded mt-1"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Επίπεδο</label>
                <select
                  className="w-full p-2 border rounded mt-1"
                  value={newClassGrade}
                  onChange={e => setNewClassGrade(e.target.value)}
                >
                  <option value="Α Γυμνασίου">Α' Γυμνασίου</option>
                  <option value="Β Γυμνασίου">Β' Γυμνασίου</option>
                  <option value="Γ Γυμνασίου">Γ' Γυμνασίου</option>
                  <option value="Α Λυκείου">Α' Λυκείου</option>
                  <option value="Β Λυκείου">Β' Λυκείου</option>
                  <option value="Γ Λυκείου">Γ' Λυκείου</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleCreateClass} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Δημιουργία Τάξης
                </Button>
              </div>
            </div>
          </div>
          
          {/* Γυμνάσιο */}
          <div>
            <h3 className="text-xl font-bold mb-4">Τάξεις Γυμνασίου</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Α' Γυμνασίου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Α Γυμνασίου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Β' Γυμνασίου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Β Γυμνασίου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Γ' Γυμνασίου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Γ Γυμνασίου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
            </div>
          </div>
          
          {/* Λύκειο */}
          <div>
            <h3 className="text-xl font-bold mb-4">Τάξεις Λυκείου</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Α' Λυκείου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Α Λυκείου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Β' Λυκείου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Β Λυκείου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Γ' Λυκείου</h4>
                <ClassroomTable 
                  classrooms={classrooms} 
                  gradeLevel="Γ Λυκείου" 
                  onDeleteClass={deleteClassroom} 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassesTab;
