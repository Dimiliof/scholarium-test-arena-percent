
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, BookOpen, Filter, User, Users, BookCopy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { subjects } from '@/lib/subjectsData';
import { QuizQuestion } from '@/lib/subjectsData';
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

const quizTypeLabels: Record<string, string> = {
  'basic': 'Βασικές Ασκήσεις',
  'intermediate': 'Ενδιάμεσες Ασκήσεις',
  'advanced': 'Προχωρημένες Ασκήσεις',
  'quick': 'Διαγώνισμα 15 λεπτών',
  'medium': 'Διαγώνισμα 30 λεπτών',
  'full': 'Διαγώνισμα Εφ\' Όλης της Ύλης',
};

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
  
  // Νέες μεταβλητές κατάστασης για τους μαθητές και τα αποτελέσματα
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(true);
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  const [selectedStudentSubject, setSelectedStudentSubject] = useState<string>('all');
  const [resultSearchTerm, setResultSearchTerm] = useState<string>('');
  const [selectedResultSubject, setSelectedResultSubject] = useState<string>('all');

  useEffect(() => {
    // Φόρτωση περιεχομένου, μαθητών και αποτελεσμάτων
    loadTeacherContent();
    loadEnrolledStudents();
    loadStudentResults();
  }, [user?.id]);

  const loadTeacherContent = () => {
    setIsLoading(true);
    
    try {
      // Συγκέντρωση όλων των ερωτήσεων από το localStorage
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
      
      // Ταξινόμηση με βάση την ημερομηνία (πιο πρόσφατες πρώτα)
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
    
    // Προσωρινά δημιουργούμε κάποια δεδομένα για τους εγγεγραμμένους μαθητές
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
    
    // Αποθήκευση των δεδομένων στο localStorage αν δεν υπάρχουν
    if (!localStorage.getItem('enrolled_students')) {
      localStorage.setItem('enrolled_students', JSON.stringify(mockStudents));
    }
    
    // Φόρτωση των δεδομένων από το localStorage
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
    
    // Προσωρινά δημιουργούμε κάποια δεδομένα για τα αποτελέσματα των μαθητών
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
    
    // Αποθήκευση των δεδομένων στο localStorage αν δεν υπάρχουν
    if (!localStorage.getItem('student_results')) {
      localStorage.setItem('student_results', JSON.stringify(mockResults));
    }
    
    // Φόρτωση των δεδομένων από το localStorage
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

  const handleEdit = (item: TeacherContent) => {
    // Για τώρα, θα κάνουμε μόνο περιήγηση στη σελίδα προσθήκης περιεχομένου
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
        
        // Ενημέρωση της λίστας περιεχομένου
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
            <p className="text-muted-foreground">Διαχειριστείτε τις ερωτήσεις, τους μαθητές και τα αποτελέσματα</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => navigate('/add-content')} className="flex items-center gap-2">
              <Plus size={16} />
              <span>Προσθήκη Νέας Ερώτησης</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <BookCopy className="h-4 w-4" />
              <span>Ερωτήσεις</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Μαθητές</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Αποτελέσματα</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Περιεχομένου Ερωτήσεων */}
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
          
          {/* Tab Μαθητών */}
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
          
          {/* Tab Αποτελεσμάτων */}
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
      
      {/* Dialog επιβεβαίωσης διαγραφής */}
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
      
      <Footer />
    </div>
  );
};

export default TeacherDashboardPage;
