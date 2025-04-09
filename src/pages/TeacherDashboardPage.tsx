import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { subjects, QuizQuestion } from '@/lib/subjectsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search } from 'lucide-react';

interface TeacherContent {
  id: number;
  question: string;
  subjectId: string;
  quizType: string;
  dateAdded: string;
}

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

const TeacherDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [classrooms, setClassrooms] = useState<ClassData[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Α Γυμνασίου');
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const { isAuthenticated, isTeacher, user } = useAuth();
  const navigate = useNavigate();

  const subjectPerformanceData = [
    { name: 'Μαθηματικά', score: 78 },
    { name: 'Φυσική', score: 65 },
    { name: 'Χημεία', score: 72 },
    { name: 'Πληροφορική', score: 85 },
    { name: 'Βιολογία', score: 70 },
  ];

  const classDistributionData = [
    { name: 'Άριστα', value: 25 },
    { name: 'Πολύ Καλά', value: 40 },
    { name: 'Καλά', value: 20 },
    { name: 'Μέτρια', value: 10 },
    { name: 'Χρειάζεται Βελτίωση', value: 5 },
  ];

  const COLORS = ['#00C49F', '#4CAF50', '#FFBB28', '#FF8042', '#FF0000'];

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate('/login');
      return;
    }

    loadTeacherContent();
    loadClassrooms();
    loadStudents();
  }, [isAuthenticated, isTeacher, navigate]);

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
                dateAdded: new Date().toLocaleDateString('el-GR'),
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

  const loadClassrooms = () => {
    const savedClassrooms = localStorage.getItem('teacher_classrooms');
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    } else {
      const defaultClassrooms: ClassData[] = [
        { id: '1', name: 'Τμήμα Α1', gradeLevel: 'Α Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '2', name: 'Τμήμα Β1', gradeLevel: 'Β Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '3', name: 'Τμήμα Γ1', gradeLevel: 'Γ Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '4', name: 'Τμήμα Α1', gradeLevel: 'Α Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '5', name: 'Τμήμα Β1', gradeLevel: 'Β Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '6', name: 'Τμήμα Γ1', gradeLevel: 'Γ Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
      ];
      setClassrooms(defaultClassrooms);
      localStorage.setItem('teacher_classrooms', JSON.stringify(defaultClassrooms));
    }
  };

  const loadStudents = () => {
    const savedStudents = localStorage.getItem('teacher_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      const defaultStudents: Student[] = [
        { id: '1', name: 'Γιάννης Παπαδόπουλος', email: 'giannis@example.com', grade: 'Α Γυμνασίου', performance: 85, lastActive: '2025-04-08', classroom: '1' },
        { id: '2', name: 'Μαρία Κωνσταντίνου', email: 'maria@example.com', grade: 'Α Γυμνασίου', performance: 92, lastActive: '2025-04-07', classroom: '1' },
        { id: '3', name: 'Νίκος Αντωνίου', email: 'nikos@example.com', grade: 'Β Γυμνασίου', performance: 78, lastActive: '2025-04-09', classroom: '2' },
        { id: '4', name: 'Ελένη Δημητρίου', email: 'eleni@example.com', grade: 'Β Γυμνασίου', performance: 89, lastActive: '2025-04-06', classroom: '2' },
        { id: '5', name: 'Κώστας Ιωάννου', email: 'kostas@example.com', grade: 'Γ Γυμνασίου', performance: 76, lastActive: '2025-04-08', classroom: '3' },
        { id: '6', name: 'Σοφία Μακρή', email: 'sofia@example.com', grade: 'Γ Γυμνασίου', performance: 94, lastActive: '2025-04-07', classroom: '3' },
        { id: '7', name: 'Δημήτρης Αλεξίου', email: 'dimitris@example.com', grade: 'Α Λυκείου', performance: 83, lastActive: '2025-04-09', classroom: '4' },
        { id: '8', name: 'Αναστασία Νικολάου', email: 'anastasia@example.com', grade: 'Α Λυκείου', performance: 88, lastActive: '2025-04-05', classroom: '4' },
        { id: '9', name: 'Βασίλης Γεωργίου', email: 'vasilis@example.com', grade: 'Β Λυκείου', performance: 81, lastActive: '2025-04-08', classroom: '5' },
        { id: '10', name: 'Αγγελική Παππά', email: 'aggeliki@example.com', grade: 'Β Λυκείου', performance: 90, lastActive: '2025-04-06', classroom: '5' },
        { id: '11', name: 'Χρήστος Μιχαηλίδης', email: 'christos@example.com', grade: 'Γ Λυκείου', performance: 95, lastActive: '2025-04-07', classroom: '6' },
        { id: '12', name: 'Κατερίνα Βασιλείου', email: 'katerina@example.com', grade: 'Γ Λυκείου', performance: 87, lastActive: '2025-04-09', classroom: '6' },
      ];
      setStudents(defaultStudents);
      localStorage.setItem('teacher_students', JSON.stringify(defaultStudents));
    }
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) {
      toast.error('Παρακαλώ εισάγετε όνομα τάξης');
      return;
    }

    const newClass: ClassData = {
      id: Date.now().toString(),
      name: newClassName,
      gradeLevel: newClassGrade,
      studentsCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedClassrooms = [...classrooms, newClass];
    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    
    setNewClassName('');
    toast.success('Η τάξη δημιουργήθηκε με επιτυχία');
  };

  const handleDeleteClass = (classId: string) => {
    const updatedClassrooms = classrooms.filter(c => c.id !== classId);
    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    toast.success('Η τάξη διαγράφηκε με επιτυχία');
  };

  const handleAddStudent = () => {
    toast.info('Η λειτουργία προσθήκης νέου μαθητή θα είναι διαθέσιμη σύντομα');
  };

  const handleEditStudent = (studentId: string) => {
    toast.info(`Επεξεργασία στοιχείων μαθητή με ID: ${studentId}`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('teacher_students', JSON.stringify(updatedStudents));
    toast.success('Ο μαθητής διαγράφηκε με επιτυχία');
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο';
  };

  const getQuizTypeName = (quizType: string) => {
    const types: Record<string, string> = {
      'basic': 'Βασικό',
      'intermediate': 'Μεσαίο',
      'advanced': 'Προχωρημένο',
      'quick': 'Γρήγορο',
      'medium': 'Μεσαίο',
      'full': 'Πλήρες'
    };
    return types[quizType] || quizType;
  };

  const classroomsByGrade = (grade: string) => {
    return classrooms.filter(c => c.gradeLevel === grade);
  };

  const getClassroomName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : 'Άγνωστη τάξη';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(studentSearchQuery.toLowerCase());
    const matchesClassroom = selectedClassroom === 'all' || student.classroom === selectedClassroom;
    return matchesSearch && matchesClassroom;
  });

  const renderClassroomsTable = (gradeLevel: string) => {
    const filteredClassrooms = classroomsByGrade(gradeLevel);
    
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
                    onClick={() => navigate(`/classroom/${classroom.id}`)}
                  >
                    Διαχείριση
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteClass(classroom.id)}
                  >
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

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Πίνακας Ελέγχου Εκπαιδευτικού</h1>
          <p className="text-muted-foreground">
            Διαχειριστείτε το περιεχόμενό σας και τις τάξεις σας
          </p>
        </div>
        
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}` : ''} alt={user?.email || 'Προφίλ'} />
          <AvatarFallback>
            {user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="content">Περιεχόμενο</TabsTrigger>
          <TabsTrigger value="classes">Τάξεις</TabsTrigger>
          <TabsTrigger value="students">Μαθητές</TabsTrigger>
          <TabsTrigger value="stats">Στατιστικά</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Το περιεχόμενό μου</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις ερωτήσεις και τα κουίζ που έχετε δημιουργήσει.
              </CardDescription>
              
              <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Αναζήτηση ερωτήσεων..."
                      className="w-full p-2 border rounded"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    value={selectedSubject} 
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="all">Όλα τα μαθήματα</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button onClick={() => navigate('/add-content')}>
                  Προσθήκη Περιεχομένου
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Φόρτωση...</p>
                </div>
              ) : filteredContent.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ερώτηση</TableHead>
                      <TableHead>Μάθημα</TableHead>
                      <TableHead>Τύπος Κουίζ</TableHead>
                      <TableHead>Ημ/νία Προσθήκης</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.question}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getSubjectName(item.subjectId)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getQuizTypeName(item.quizType)}</TableCell>
                        <TableCell>{item.dateAdded}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Δεν βρέθηκε περιεχόμενο. Προσθέστε νέο περιεχόμενο για να εμφανιστεί εδώ.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/add-content')}
                  >
                    Προσθήκη Περιεχομένου
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Οι τάξεις μου</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις ηλεκτρονικές τάξεις και τους μαθητές σας.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Δημιου��γία Νέας Τάξης</h3>
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
                        Δημιουργία Τάξης
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Τάξεις Γυμνασίου</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Α' Γυμνασίου</h4>
                      {renderClassroomsTable('Α Γυμνασίου')}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Β' Γυμνασίου</h4>
                      {renderClassroomsTable('Β Γυμνασίου')}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Γ' Γυμνασίου</h4>
                      {renderClassroomsTable('Γ Γυμνασίου')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Τάξεις Λυκείου</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Α' Λυκείου</h4>
                      {renderClassroomsTable('Α Λυκείου')}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Β' Λυκείου</h4>
                      {renderClassroomsTable('Β Λυκείου')}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Γ' Λυκείου</h4>
                      {renderClassroomsTable('Γ Λυκείου')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Μαθητές</CardTitle>
              <CardDescription>
                Διαχειριστείτε τους μαθητές και την πρόοδό τους.
              </CardDescription>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Αναζήτηση μαθητών..."
                      className="w-full pl-10 p-2 border rounded"
                      value={studentSearchQuery}
                      onChange={e => setStudentSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    value={selectedClassroom} 
                    onChange={e => setSelectedClassroom(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="all">Όλες οι τάξεις</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name} ({classroom.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button onClick={handleAddStudent}>
                  Προσθήκη Μαθητή
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ονοματεπώνυμο</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Τάξη</TableHead>
                      <TableHead>Επίδοση</TableHead>
                      <TableHead>Τελευταία Είσοδος</TableHead>
                      <TableHead>Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {getClassroomName(student.classroom)} ({student.grade})
                        </TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(student.performance)}>
                            {student.performance}%
                          </span>
                        </TableCell>
                        <TableCell>{student.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditStudent(student.id)}
                            >
                              Επεξεργασία
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              Διαγραφή
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Δεν βρέθηκαν μαθητές που να ταιριάζουν με τα κριτήρια αναζήτησης.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Στατιστικά</CardTitle>
              <CardDescription>
                Δείτε στατιστικά επίδοσης των μαθητών σας ανά μάθημα και τάξη.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Μέση Επίδοση ανά Μάθημα</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={subjectPerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#4f46e5" name="Μέση Βαθμολογία (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Κατανομή Επιδόσεων</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} μαθητές`, 'Αριθμός']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Συνολική Στατιστική Εικόνα</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h4 className="text-sm font-medium text-blue-700">Σύνολο Μαθητών</h4>
                      <p className="text-3xl font-bold mt-2">{students.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <h4 className="text-sm font-medium text-green-700">Μέση Επίδοση</h4>
                      <p className="text-3xl font-bold mt-2">
                        {students.length > 0 
                          ? Math.round(students.reduce((sum, s) => sum + s.performance, 0) / students.length) 
                          : 0}%
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <h4 className="text-sm font-medium text-purple-700">Ενεργοί Μαθητές (7 ημέρες)</h4>
                      <p className="text-3xl font-bold mt-2">
                        {students.filter(s => {
                          const lastActive = new Date(s.lastActive);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return lastActive >= weekAgo;
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
