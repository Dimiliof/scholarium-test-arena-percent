
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useTeacherClassrooms } from '@/hooks/useTeacherClassrooms';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

const ClassroomManagementPage: React.FC = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher } = useAuth();
  const { toast: uiToast } = useToast();
  const { 
    classrooms, 
    loadClassrooms, 
    addStudentToClassroom,
    removeStudentFromClassroom 
  } = useTeacherClassrooms();
  
  const [classroom, setClassroom] = useState<any>(null);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate('/login');
      return;
    }
    
    loadClassrooms();
  }, [isAuthenticated, isTeacher, navigate, loadClassrooms]);
  
  useEffect(() => {
    if (classrooms.length > 0 && classroomId) {
      const found = classrooms.find(c => c.id === classroomId);
      if (found) {
        setClassroom(found);
        
        // Φόρτωση μαθητών από localStorage ή δημιουργία κενής λίστας
        const classroomStudents = localStorage.getItem(`classroom_students_${classroomId}`);
        if (classroomStudents) {
          setStudents(JSON.parse(classroomStudents));
        } else {
          setStudents([]);
          localStorage.setItem(`classroom_students_${classroomId}`, JSON.stringify([]));
        }
      } else {
        uiToast({
          title: "Σφάλμα",
          description: "Η τάξη δεν βρέθηκε",
          variant: "destructive"
        });
        navigate('/teacher-dashboard');
      }
    }
  }, [classrooms, classroomId, uiToast, navigate]);
  
  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      toast.error('Παρακαλώ εισάγετε όνομα μαθητή');
      return;
    }
    
    // Έλεγχος email
    if (newStudentEmail && !isValidEmail(newStudentEmail)) {
      toast.error('Παρακαλώ εισάγετε έγκυρο email');
      return;
    }
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName,
      email: newStudentEmail || '-',
      joinDate: new Date().toISOString()
    };
    
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem(`classroom_students_${classroomId}`, JSON.stringify(updatedStudents));
    
    // Ενημέρωση του αριθμού μαθητών στην τάξη
    if (classroomId) {
      addStudentToClassroom(classroomId);
    }
    
    setNewStudentName('');
    setNewStudentEmail('');
    setIsAddStudentDialogOpen(false);
    toast.success('Ο μαθητής προστέθηκε με επιτυχία');
  };
  
  const handleRemoveStudent = (studentId: string) => {
    const confirmRemove = window.confirm('Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτόν τον μαθητή;');
    if (!confirmRemove) return;
    
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem(`classroom_students_${classroomId}`, JSON.stringify(updatedStudents));
    
    // Ενημέρωση του αριθμού μαθητών στην τάξη
    if (classroomId) {
      removeStudentFromClassroom(classroomId);
    }
    
    toast.success('Ο μαθητής αφαιρέθηκε με επιτυχία');
  };
  
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  if (!classroom) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Φόρτωση τάξης...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate('/teacher-dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στον Πίνακα Ελέγχου
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <p className="text-muted-foreground">{classroom.gradeLevel}</p>
          </div>
          
          <Button onClick={() => setIsAddStudentDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Προσθήκη Μαθητή
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Μαθητές ({classroom.studentsCount})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Δεν υπάρχουν μαθητές</h3>
                <p className="text-muted-foreground mb-4">Δεν έχετε προσθέσει ακόμα μαθητές σε αυτή την τάξη.</p>
                <Button onClick={() => setIsAddStudentDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Προσθήκη Πρώτου Μαθητή
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ονοματεπώνυμο</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ημερομηνία Εγγραφής</TableHead>
                    <TableHead>Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{new Date(student.joinDate).toLocaleDateString('el-GR')}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Προσθήκη Νέου Μαθητή</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Ονοματεπώνυμο</Label>
                <Input
                  id="studentName"
                  placeholder="π.χ. Γιώργος Παπαδόπουλος"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email (προαιρετικό)</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder="π.χ. student@example.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
                Άκυρο
              </Button>
              <Button onClick={handleAddStudent}>
                Προσθήκη
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default ClassroomManagementPage;
