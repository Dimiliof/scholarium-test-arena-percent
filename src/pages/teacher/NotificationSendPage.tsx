
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ClassData {
  id: string;
  name: string;
  gradeLevel: string;
  studentsCount: number;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  performance: number;
  lastActive: string;
  classroom: string;
}

const NotificationSendPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [notificationType, setNotificationType] = useState<NotificationType>('info');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [classrooms, setClassrooms] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const { user, isAuthenticated, isTeacher } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate('/login');
      return;
    }

    // Φόρτωση τάξεων και μαθητών
    const savedClassrooms = localStorage.getItem('teacher_classrooms');
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    }

    const savedStudents = localStorage.getItem('teacher_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, [isAuthenticated, isTeacher, navigate]);

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Παρακαλώ συμπληρώστε τον τίτλο και το μήνυμα της ειδοποίησης');
      return;
    }

    if (!user) {
      toast.error('Παρακαλώ συνδεθείτε για να στείλετε ειδοποίηση');
      return;
    }

    let recipientId: string | undefined = undefined;
    let recipientIds: string[] | undefined = undefined;
    let classroomId: string | undefined = undefined;

    // Ρύθμιση παραληπτών ανάλογα με την επιλογή
    if (recipientType === 'classroom' && selectedClassroom) {
      classroomId = selectedClassroom;
      // Βρίσκουμε όλους τους μαθητές της επιλεγμένης τάξης
      recipientIds = students
        .filter(s => s.classroom === selectedClassroom)
        .map(s => s.id);
    } else if (recipientType === 'specific' && selectedStudents.length > 0) {
      recipientIds = selectedStudents;
    }

    addNotification({
      title,
      message,
      type: notificationType,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      recipientId,
      recipientIds,
      classroomId
    });

    // Επαναφορά της φόρμας
    setTitle('');
    setMessage('');
    setNotificationType('info');
    setRecipientType('all');
    setSelectedClassroom('');
    setSelectedStudents([]);

    toast.success('Η ειδοποίηση στάλθηκε με επιτυχία');
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <Helmet>
        <title>Αποστολή Ειδοποιήσεων | Εκπαιδευτική Πλατφόρμα</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Αποστολή Ειδοποιήσεων</h1>
        <p className="text-muted-foreground">
          Στείλτε ειδοποιήσεις στους μαθητές σας
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Νέα Ειδοποίηση</CardTitle>
          <CardDescription>
            Συμπληρώστε τα στοιχεία της ειδοποίησης που θέλετε να στείλετε
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Τίτλος</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Εισάγετε τον τίτλο της ειδοποίησης" 
              />
            </div>

            <div>
              <Label htmlFor="message">Μήνυμα</Label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Εισάγετε το μήνυμα της ειδοποίησης" 
                rows={4} 
              />
            </div>

            <div>
              <Label>Τύπος Ειδοποίησης</Label>
              <RadioGroup value={notificationType} onValueChange={(value) => setNotificationType(value as NotificationType)} className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="info" id="info" />
                  <Label htmlFor="info" className="cursor-pointer">Πληροφορία</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="warning" id="warning" />
                  <Label htmlFor="warning" className="cursor-pointer">Προειδοποίηση</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="success" id="success" />
                  <Label htmlFor="success" className="cursor-pointer">Επιτυχία</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="error" id="error" />
                  <Label htmlFor="error" className="cursor-pointer">Σφάλμα</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Αποστολή προς</Label>
              <RadioGroup value={recipientType} onValueChange={setRecipientType} className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">Όλους τους Μαθητές</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="classroom" id="classroom" />
                  <Label htmlFor="classroom" className="cursor-pointer">Συγκεκριμένη Τάξη</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific" className="cursor-pointer">Επιλεγμένους Μαθητές</Label>
                </div>
              </RadioGroup>
            </div>

            {recipientType === 'classroom' && (
              <div>
                <Label htmlFor="classroom">Επιλογή Τάξης</Label>
                <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε τάξη" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map(classroom => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.name} ({classroom.gradeLevel})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {recipientType === 'specific' && (
              <div>
                <Label>Επιλογή Μαθητών</Label>
                <div className="mt-2 border rounded-md p-3 max-h-60 overflow-y-auto">
                  {students.length === 0 ? (
                    <p className="text-muted-foreground">Δεν υπάρχουν διαθέσιμοι μαθητές</p>
                  ) : (
                    <ul className="space-y-2">
                      {students.map(student => (
                        <li key={student.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                            className="rounded"
                          />
                          <Label htmlFor={`student-${student.id}`} className="cursor-pointer">
                            {student.name} - {student.email} ({getClassroomName(student.classroom, classrooms)})
                          </Label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Οι ειδοποιήσεις θα εμφανιστούν στο πάνελ ειδοποιήσεων των μαθητών και θα παραμείνουν διαθέσιμες μέχρι να τις διαγράψουν.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button onClick={handleSendNotification} className="w-full sm:w-auto">
                <Check className="mr-2 h-4 w-4" />
                Αποστολή Ειδοποίησης
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Βοηθητική συνάρτηση για την εύρεση του ονόματος της τάξης
function getClassroomName(classroomId: string, classrooms: ClassData[]): string {
  const classroom = classrooms.find(c => c.id === classroomId);
  return classroom ? `${classroom.name} (${classroom.gradeLevel})` : 'Άγνωστη τάξη';
}

export default NotificationSendPage;
