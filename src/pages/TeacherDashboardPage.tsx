import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Filter, 
  User, 
  Users, 
  BookCopy, 
  GraduationCap,
  School,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { subjects } from '@/lib/subjectsData';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

type TeacherContent = {
  id: number;
  question: string;
  subjectId: string;
  quizType: string;
  dateAdded: string;
};

type StudentResult = {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: string;
  quizType: string;
  score: number;
  maxScore: number;
  dateCompleted: string;
};

type EnrolledStudent = {
  id: number;
  name: string;
  email: string;
  enrollDate: string;
  subjectId: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
};

type ClassRoom = {
  id: number;
  name: string;
  grade: 'Α_ΓΥΜΝΑΣΙΟΥ' | 'Β_ΓΥΜΝΑΣΙΟΥ' | 'Γ_ΓΥΜΝΑΣΙΟΥ' | 'Α_ΛΥΚΕΙΟΥ' | 'Β_ΛΥΚΕΙΟΥ' | 'Γ_ΛΥΚΕΙΟΥ';
  subjectId: string;
  teacherId: number;
  studentCount: number;
  createdAt: string;
  status: 'active' | 'archived';
  description?: string;
};

const quizTypeLabels: Record<string, string> = {
  'basic': 'Βασικές Ασκήσεις',
  'intermediate': 'Ενδιάμεσες Ασκήσεις',
  'advanced': 'Προχωρημένες Ασκήσεις',
  'quick': 'Διαγώνισμα 15 λεπτών',
  'medium': 'Διαγώνισμα 30 λεπτών',
  'full': 'Διαγώνισμα Εφ\' Όλης της Ύλης',
};

const gradeLabels: Record<string, string> = {
  'Α_ΓΥΜΝΑΣΙΟΥ': 'Α\' Γυμνασίου',
  'Β_ΓΥΜΝΑΣΙΟΥ': 'Β\' Γυμνασίου',
  'Γ_ΓΥΜΝΑΣΙΟΥ': 'Γ\' Γυμνασίου',
  'Α_ΛΥΚΕΙΟΥ': 'Α\' Λυκείου',
  'Β_ΛΥΚΕΙΟΥ': 'Β\' Λυκείου',
  'Γ_ΛΥΚΕΙΟΥ': 'Γ\' Λυκείου',
};

const gradeOptions = Object.entries(gradeLabels).map(([value, label]) => ({
  value,
  label
}));

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedQuizType, setSelectedQuizType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<TeacherContent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('questions');
  
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(true);
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  const [selectedStudentSubject, setSelectedStudentSubject] = useState<string>('all');
  const [resultSearchTerm, setResultSearchTerm] = useState<string>('');
  const [selectedResultSubject, setSelectedResultSubject] = useState<string>('all');

  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState<boolean>(true);
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>('all');
  const [selectedClassSubject, setSelectedClassSubject] = useState<string>('all');
  const [classSearchTerm, setClassSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);
  const [deleteClassDialogOpen, setDeleteClassDialogOpen] = useState<boolean>(false);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState<boolean>(false);
  
  const [newClass, setNewClass] = useState<{
    name: string;
    grade: string;
    subjectId: string;
    description: string;
  }>({
    name: '',
    grade: 'Α_ΓΥΜΝΑΣΙΟΥ',
    subjectId: '',
    description: '',
  });

  useEffect(() => {
    loadTeacherContent();
    loadEnrolledStudents();
    loadStudentResults();
    loadClassrooms();
  }, [user?.id]);

  const loadTeacherContent = () => {
    setIsLoading(true);
    
    try {
      let allContent: TeacherContent[] = [];
      
      for (const subject of subjects) {
        for (const quizType of ['basic', 'intermediate', 'advanced', 'quick', 'medium', 'full']) {
          const storageKey = `quiz_${subject.id}_${quizType}`;
          const storedQuestions = localStorage.getItem(storageKey);
          
          if (storedQuestions) {
            try {
              const questions: QuizQuestion[] = JSON.parse(storedQuestions);
              
              const mappedQuestions: TeacherContent[] = questions.map(q => ({
                id: q.id,
                question: q.question,
                subjectId: subject.id,
                quizType: quizType,
                dateAdded: new Date(q.id).toLocaleDateString('el-GR'),
              }));
              
              allContent = [...allContent, ...mappedQuestions];
            } catch (e) {
              console.error("Σφάλμα κατά την ανάγνωση των αποθηκευμένων ερωτήσεων:", e);
            }
          }
        }
      }
      
      allContent.sort((a, b) => b.id - a.id);
      
      setContent(allContent);
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του περιεχομένου:", error);
      toast.error("Σφάλμα κατά τη φόρτωση του περιεχομένου");
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrolledStudents = () => {
    setIsLoadingStudents(true);
    
    const mockStudents: EnrolledStudent[] = [
      {
        id: 1,
        name: "Γιάννης Παπαδόπουλος",
        email: "giannis@example.com",
        enrollDate: "01/09/2024",
        subjectId: "mathematics",
        status: "active",
        progress: 65
      },
      {
        id: 2,
        name: "Μαρία Αντωνίου",
        email: "maria@example.com",
        enrollDate: "15/09/2024",
        subjectId: "physics",
        status: "active",
        progress: 42
      },
      {
        id: 3,
        name: "Νίκος Κωνσταντίνου",
        email: "nikos@example.com",
        enrollDate: "05/09/2024",
        subjectId: "literature",
        status: "completed",
        progress: 100
      },
      {
        id: 4,
        name: "Ελένη Δημητρίου",
        email: "eleni@example.com",
        enrollDate: "10/09/2024",
        subjectId: "mathematics",
        status: "active",
        progress: 78
      },
      {
        id: 5,
        name: "Δημήτρης Αλεξίου",
        email: "dimitris@example.com",
        enrollDate: "20/09/2024",
        subjectId: "physics",
        status: "pending",
        progress: 12
      }
    ];
    
    if (!localStorage.getItem('enrolled_students')) {
      localStorage.setItem('enrolled_students', JSON.stringify(mockStudents));
    }
    
    const storedStudents = localStorage.getItem('enrolled_students');
    if (storedStudents) {
      try {
        const parsedStudents: EnrolledStudent[] = JSON.parse(storedStudents);
        setStudents(parsedStudents);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των εγγεγραμμένων μαθητών:", e);
        setStudents([]);
      }
    }
    
    setIsLoadingStudents(false);
  };

  const loadStudentResults = () => {
    setIsLoadingResults(true);
    
    const mockResults: StudentResult[] = [
      {
        id: 1,
        studentId: 1,
        studentName: "Γιάννης Παπαδόπουλος",
        subjectId: "mathematics",
        quizType: "basic",
        score: 8,
        maxScore: 10,
        dateCompleted: "15/09/2024"
      },
      {
        id: 2,
        studentId: 1,
        studentName: "Γιάννης Παπαδόπουλος",
        subjectId: "mathematics",
        quizType: "intermediate",
        score: 7,
        maxScore: 10,
        dateCompleted: "20/09/2024"
      },
      {
        id: 3,
        studentId: 2,
        studentName: "Μαρία Αντωνίου",
        subjectId: "physics",
        quizType: "basic",
        score: 9,
        maxScore: 10,
        dateCompleted: "18/09/2024"
      },
      {
        id: 4,
        studentId: 3,
        studentName: "Νίκος Κωνσταντίνου",
        subjectId: "literature",
        quizType: "full",
        score: 14,
        maxScore: 15,
        dateCompleted: "22/09/2024"
      },
      {
        id: 5,
        studentId: 4,
        studentName: "Ελένη Δημητρίου",
        subjectId: "mathematics",
        quizType: "medium",
        score: 9,
        maxScore: 10,
        dateCompleted: "21/09/2024"
      }
    ];
    
    if (!localStorage.getItem('student_results')) {
      localStorage.setItem('student_results', JSON.stringify(mockResults));
    }
    
    const storedResults = localStorage.getItem('student_results');
    if (storedResults) {
      try {
        const parsedResults: StudentResult[] = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των αποτελεσμάτων μαθητών:", e);
        setResults([]);
      }
    }
    
    setIsLoadingResults(false);
  };

  const loadClassrooms = () => {
    setIsLoadingClassrooms(true);
    
    const mockClassrooms: ClassRoom[] = [
      {
        id: 1,
        name: "Μαθηματικά Α' Γυμνασίου - Τμήμα 1",
        grade: "Α_ΓΥΜΝΑΣΙΟΥ",
        subjectId: "mathematics",
        teacherId: 1,
        studentCount: 25,
        createdAt: "01/09/2024",
        status: "active",
        description: "Τμήμα μαθηματικών για μαθητές Α' Γυμνασίου"
      },
      {
        id: 2,
        name: "Φυσική Β' Γυμνασίου - Τμήμα 1",
        grade: "Β_ΓΥΜΝΑΣΙΟΥ",
        subjectId: "physics",
        teacherId: 1,
        studentCount: 22,
        createdAt: "01/09/2024",
        status: "active",
        description: "Βασικές αρχές φυσικής για μαθητές Β' Γυμνασίου"
      },
      {
        id: 3,
        name: "Λογοτεχνία Γ' Γυμνασίου",
        grade: "Γ_ΓΥΜΝΑΣΙΟΥ",
        subjectId: "literature",
        teacherId: 1,
        studentCount: 28,
        createdAt: "05/09/2024",
        status: "active",
        description: "Μαθήματα λογοτεχνίας για την Γ' Γυμνασίου"
      },
      {
        id: 4,
        name: "Άλγεβρα Α' Λυκείου",
        grade: "Α_ΛΥΚΕΙΟΥ",
        subjectId: "mathematics",
        teacherId: 1,
        studentCount: 18,
        createdAt: "02/09/2024",
        status: "active",
        description: "Προχωρημένα μαθηματικά για την Α' Λυκείου"
      },
      {
        id: 5,
        name: "Χημεία Β' Λυκείου - Εργαστήριο",
        grade: "Β_ΛΥΚΕΙΟΥ",
        subjectId: "chemistry",
        teacherId: 1,
        studentCount: 15,
        createdAt: "03/09/2024",
        status: "active",
        description: "Εργαστηριακά μαθήματα χημείας"
      },
      {
        id: 6,
        name: "Μαθηματικά Γ' Λυκείου - Προετοιμασία Πανελλαδικών",
        grade: "Γ_ΛΥΚΕΙΟΥ",
        subjectId: "mathematics",
        teacherId: 1,
        studentCount: 12,
        createdAt: "01/09/2024",
        status: "active",
        description: "Εντατικά μαθήματα προετοιμασίας για τις πανελλαδικές"
      }
    ];
    
    if (!localStorage.getItem('classrooms')) {
      localStorage.setItem('classrooms', JSON.stringify(mockClassrooms));
    }
    
    const storedClassrooms = localStorage.getItem('classrooms');
    
    if (storedClassrooms) {
      try {
        const parsedClassrooms: ClassRoom[] = JSON.parse(storedClassrooms);
        setClassrooms(parsedClassrooms);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των τάξεων:", e);
        setClassrooms([]);
      }
    }
    
    setIsLoadingClassrooms(false);
  };

  const handleAddClass = () => {
    if (!newClass.name || !newClass.subjectId) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    try {
      const storedClassrooms = localStorage.getItem('classrooms');
      let currentClassrooms: ClassRoom[] = [];
      
      if (storedClassrooms) {
        currentClassrooms = JSON.parse(storedClassrooms);
      }
      
      const newClassData: ClassRoom = {
        id: Date.now(),
        name: newClass.name,
        grade: newClass.grade as any,
        subjectId: newClass.subjectId,
        teacherId: user?.id || 1,
        studentCount: 0,
        createdAt: new Date().toLocaleDateString('el-GR'),
        status: 'active',
        description: newClass.description
      };
      
      const updatedClassrooms = [...currentClassrooms, newClassData];
      
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
      setClassrooms(updatedClassrooms);
      
      setNewClass({
        name: '',
        grade: 'Α_ΓΥΜΝΑΣΙΟΥ',
        subjectId: '',
        description: '',
      });
      
      setIsAddClassDialogOpen(false);
      toast.success("Η τάξη δημιουργήθηκε με επιτυχία");
    } catch (error) {
      console.error("Σφάλμα κατά τη δημιουργία τάξης:", error);
      toast.error("Σφάλμα κατά τη δημιουργία της τάξης");
    }
  };

  const handleDeleteClass = () => {
    if (!selectedClass) return;
    
    try {
      const storedClassrooms = localStorage.getItem('classrooms');
      
      if (storedClassrooms) {
        const currentClassrooms: ClassRoom[] = JSON.parse(storedClassrooms);
        const updatedClassrooms = currentClassrooms.filter(c => c.id !== selectedClass.id);
        
        localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
        setClassrooms(updatedClassrooms);
        toast.success("Η τάξη διαγράφηκε επιτυχώς");
      }
    } catch (error) {
      console.error("Σφάλμα κατά τη διαγραφή της τάξης:", error);
      toast.error("Σφάλμα κατά τη διαγραφή της τάξης");
    } finally {
      setSelectedClass(null);
      setDeleteClassDialogOpen(false);
    }
  };

  const handleEdit = (item: TeacherContent) => {
    navigate('/add-content');
  };

  const handleDelete = (item: TeacherContent) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;
    
    try {
      const storageKey = `quiz_${selectedItem.subjectId}_${selectedItem.quizType}`;
      const storedQuestions = localStorage.getItem(storageKey);
      
      if (storedQuestions) {
        const questions: QuizQuestion[] = JSON.parse(storedQuestions);
        const updatedQuestions = questions.filter(q => q.id !== selectedItem.id);
        
        localStorage.setItem(storageKey, JSON.stringify(updatedQuestions));
        
        setContent(content.filter(c => c.id !== selectedItem.id));
        
        toast.success("Η ερώτηση διαγράφηκε επιτυχώς");
      }
    } catch (error) {
      console.error("Σφάλμα κατά τη διαγραφή της ερώτησης:", error);
      toast.error("Σφάλμα κατά τη διαγραφή της ερώτησης");
    } finally {
      setSelectedItem(null);
      setDeleteDialogOpen(false);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    const matchesQuizType = selectedQuizType === 'all' || item.quizType === selectedQuizType;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSubject && matchesQuizType && matchesSearch;
  });

  const filteredStudents = students.filter(student => {
    const matchesSubject = selectedStudentSubject === 'all' || student.subjectId === selectedStudentSubject;
    const matchesSearch = 
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    return matchesSubject && matchesSearch;
  });

  const filteredResults = results.filter(result => {
    const matchesSubject = selectedResultSubject === 'all' || result.subjectId === selectedResultSubject;
    const matchesSearch = 
      result.studentName.toLowerCase().includes(resultSearchTerm.toLowerCase());
    
    return matchesSubject && matchesSearch;
  });

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesGrade = selectedClassGrade === 'all' || classroom.grade === selectedClassGrade;
    const matchesSubject = selectedClassSubject === 'all' || classroom.subjectId === selectedClassSubject;
    const matchesSearch = classroom.name.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
                          (classroom.description || '').toLowerCase().includes(classSearchTerm.toLowerCase());
    
    return matchesGrade && matchesSubject && matchesSearch;
  });

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ενεργός';
      case 'pending': return 'Σε εκκρεμότητα';
      case 'completed': return 'Ολοκληρωμένο';
      default: return 'Άγνωστο';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Πίνακας Εκπαιδευτικού</h1>
            <p className="text-muted-foreground">Διαχειριστείτε τις ερωτήσεις, τους μαθητές, τις τάξεις και τα αποτελέσματα</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => navigate('/add-content')} className="flex items-center gap-2">
              <Plus size={16} />
              <span>Προσθήκη Ερώτησης</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 md:w-auto w-full">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <BookCopy className="h-4 w-4" />
              <span>Ερωτήσεις</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Μαθητές</span>
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span>Τάξεις</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Αποτελέσματα</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Φίλτρα Αναζήτησης</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Μάθημα</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Όλα τα μαθήματα" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλα τα μαθήματα</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Τύπος Ερώτησης</label>
                    <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Όλοι οι τύποι" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                        {Object.entries(quizTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Αναζήτηση</label>
                    <Input 
                      placeholder="Αναζήτηση ερωτήσεων..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>Λίστα με τις ερωτήσεις που έχετε προσθέσει</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ερώτηση</TableHead>
                      <TableHead>Μάθημα</TableHead>
                      <TableHead>Τύπος</TableHead>
                      <TableHead>Ημερομηνία</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">Φόρτωση περιεχομένου...</TableCell>
                      </TableRow>
                    ) : filteredContent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                            <p>Δεν βρέθηκαν ερωτήσεις</p>
                            {content.length > 0 && (
                              <p className="text-sm text-muted-foreground">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
                            )}
                            {content.length === 0 && (
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => navigate('/add-content')}
                              >
                                Προσθήκη πρώτης ερώτησης
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium max-w-md truncate">
                            {item.question}
                          </TableCell>
                          <TableCell>{getSubjectName(item.subjectId)}</TableCell>
                          <TableCell>{quizTypeLabels[item.quizType] || item.quizType}</TableCell>
                          <TableCell>{item.dateAdded}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(item)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Φίλτρα Αναζήτησης Μαθητών</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Μάθημα</label>
                    <Select value={selectedStudentSubject} onValueChange={setSelectedStudentSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Όλα τα μαθήματα" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλα τα μαθήματα</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Αναζήτηση</label>
                    <Input 
                      placeholder="Αναζήτηση μαθητών..." 
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>Λίστα με τους εγγεγραμμένους μαθητές σας</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Όνομα</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Μάθημα</TableHead>
                      <TableHead>Ημ/νία Εγγραφής</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                      <TableHead>Πρόοδος</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingStudents ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Φόρτωση μαθητών...</TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <p>Δεν βρέθηκαν εγγεγραμμένοι μαθητές</p>
                            {students.length > 0 && (
                              <p className="text-sm text-muted-foreground">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{getSubjectName(student.subjectId)}</TableCell>
                          <TableCell>{student.enrollDate}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(student.status)} text-white`}>
                              {getStatusLabel(student.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs whitespace-nowrap">{student.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classrooms">
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Φίλτρα Αναζήτησης Τάξεων</CardTitle>
                  <CardDescription>Φιλτράρετε τις τάξεις με βάση τα παρακάτω κριτήρια</CardDescription>
                </div>
                <Button onClick={() => setIsAddClassDialogOpen(true)} className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Νέα Τάξη</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classGrade">Βαθμίδα</Label>
                    <Select value={selectedClassGrade} onValueChange={setSelectedClassGrade}>
                      <SelectTrigger id="classGrade">
                        <SelectValue placeholder="Όλες οι βαθμίδες" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλες οι βαθμίδες</SelectItem>
                        {Object.entries(gradeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="classSubject">Μάθημα</Label>
                    <Select value={selectedClassSubject} onValueChange={setSelectedClassSubject}>
                      <SelectTrigger id="classSubject">
                        <SelectValue placeholder="Όλα τα μαθήματα" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλα τα μθήματα</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="classSearch">Αναζήτηση</Label>
                    <Input 
                      id="classSearch"
                      placeholder="Αναζήτηση τάξεων..." 
                      value={classSearchTerm}
                      onChange={(e) => setClassSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {isLoadingClassrooms ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
                      <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : filteredClassrooms.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <School className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Δεν βρέθηκαν τάξεις</h3>
                  <p className="text-muted-foreground mb-4">
                    {classrooms.length > 0 
                      ? 'Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης'
                      : 'Δεν έχετε δημιουργήσει καμία ηλεκτρονική τάξη ακόμα'
                    }
                  </p>
                  <Button onClick={() => setIsAddClassDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Δημιουργία Τάξης
                  </Button>
                </div>
              ) : (
                filteredClassrooms.map((classroom) => (
                  <Card key={classroom.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{classroom.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <span className="mr-2">{gradeLabels[classroom.grade]}</span>
                            <Badge variant={classroom.status === 'active' ? 'default' : 'secondary'}>
                              {classroom.status === 'active' ? 'Ενεργή' : 'Αρχειοθετημένη'}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>{getSubjectName(classroom.subjectId)}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{classroom.studentCount} μαθητές</span>
                        </div>
                        {classroom.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {classroom.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/classroom/${classroom.id}`}>
                          Διαχείριση
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedClass(classroom);
                          setDeleteClassDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {filteredClassrooms.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableCaption>Λίστα με τις ηλεκτρονικές τάξεις σας</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Όνομα Τάξης</TableHead>
                        <TableHead>Βαθμίδα</TableHead>
                        <TableHead>Μάθημα</TableHead>
                        <TableHead>Μαθητές</TableHead>
                        <TableHead>Κατάσταση</TableHead>
                        <TableHead>Ημ/νία Δημιουργίας</TableHead>
                        <TableHead className="text-right">Ενέργειες</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClassrooms.map((classroom) => (
                        <TableRow key={classroom.id}>
                          <TableCell className="font-medium">{classroom.name}</TableCell>
                          <TableCell>{gradeLabels[classroom.grade]}</TableCell>
                          <TableCell>{getSubjectName(classroom.subjectId)}</TableCell>
                          <TableCell>{classroom.studentCount}</TableCell>
                          <TableCell>
                            <Badge variant={classroom.status === 'active' ? 'default' : 'secondary'}>
                              {classroom.status === 'active' ? 'Ενεργή' : 'Αρχειοθετημένη'}
                            </Badge>
                          </TableCell>
                          <TableCell>{classroom.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/classroom/${classroom.id}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setSelectedClass(classroom);
                                  setDeleteClassDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="results">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Φίλτρα Αναζήτησης Αποτελεσμάτων</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Μάθημα</label>
                    <Select value={selectedResultSubject} onValueChange={setSelectedResultSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Όλα τα μαθήματα" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Όλα τα μαθήματα</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Αναζήτηση</label>
                    <Input 
                      placeholder="Αναζήτηση αποτελεσμάτων..." 
                      value={resultSearchTerm}
                      onChange={(e) => setResultSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>Λίστα με τα αποτελέσματα των μαθητών</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Μαθητής</TableHead>
                      <TableHead>Μάθημα</TableHead>
                      <TableHead>Τύπος Διαγωνίσματος</TableHead>
                      <TableHead>Βαθμολογία</TableHead>
                      <TableHead>Ημερομηνία</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingResults ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">Φόρτωση αποτελεσμάτων...</TableCell>
                      </TableRow>
                    ) : filteredResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                            <p>Δεν βρέθηκαν αποτελέσματα</p>
                            {results.length > 0 && (
                              <p className="text-sm text-muted-foreground">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.studentName}</TableCell>
                          <TableCell>{getSubjectName(result.subjectId)}</TableCell>
                          <TableCell>{quizTypeLabels[result.quizType] || result.quizType}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${result.score / result.maxScore >= 0.6 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.score}/{result.maxScore}
                            </span>
                          </TableCell>
                          <TableCell>{result.dateCompleted}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Επιβεβαίωση Διαγραφής</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την ερώτηση; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteClassDialogOpen} onOpenChange={setDeleteClassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Τάξης</DialogTitle>
            <DialogDescription>
              Είστε βέβαιοι ότι θέλετε να διαγράψετε την τάξη "{selectedClass?.name}";<br />
              Η ενέργεια αυτή δεν μπορεί να αναιρεθεί και όλα τα δεδομένα της τάξης θα χαθούν.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteClassDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Δημιουργία Νέας Τάξης</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα παρακάτω στοιχεία για να δημιουργήσετε μια νέα ηλεκτρονική τάξη.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className" className="text-right">
                Όνομα Τάξης *
              </Label>
              <Input
                id="className"
                placeholder="π.χ. Μαθηματικά Α' Γυμνασίου - Τμήμα 1"
                value={newClass.name}
                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="classGrade" className="text-right">
                Βαθμίδα *
              </Label>
              <Select 
                value={newClass.grade} 
                onValueChange={(value) => setNewClass({...newClass, grade: value})}
              >
                <SelectTrigger id="classGrade">
                  <SelectValue placeholder="Επιλέξτε βαθμίδα" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="classSubject" className="text-right">
                Μάθημα *
              </Label>
              <Select 
                value={newClass.subjectId} 
                onValueChange={(value) => setNewClass({...newClass, subjectId: value})}
              >
                <SelectTrigger id="classSubject">
                  <SelectValue placeholder="Επιλέξτε μάθημα" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="classDescription" className="text-right">
                Περιγραφή
              </Label>
              <Textarea
                id="classDescription"
                placeholder="Προαιρετική περιγραφή της τάξης..."
                value={newClass.description}
                onChange={(e) => setNewClass({...newClass, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClassDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button onClick={handleAddClass}>Δημιουργία Τάξης</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default TeacherDashboardPage;
