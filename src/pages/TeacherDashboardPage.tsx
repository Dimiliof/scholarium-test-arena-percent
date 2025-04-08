
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
import { subjectsData } from '@/lib/subjectsData';

// Ορισμός τύπων για τα δεδομένα
interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  answer?: string;
  correct?: string;
  explanation?: string;
}

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

const TeacherDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [classrooms, setClassrooms] = useState<ClassData[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Α Γυμνασίου');
  const { isAuthenticated, isTeacher, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate('/login');
      return;
    }

    loadTeacherContent();
    loadClassrooms();
  }, [isAuthenticated, isTeacher, navigate]);

  const loadTeacherContent = () => {
    setIsLoading(true);
    
    try {
      let allContent: TeacherContent[] = [];
      
      for (const subject of subjectsData) {
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
    // Φόρτωση τάξεων από localStorage ή API
    const savedClassrooms = localStorage.getItem('teacher_classrooms');
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    } else {
      // Δημιουργία προεπιλεγμένων τάξεων για όλες τις βαθμίδες
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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getSubjectName = (subjectId: string) => {
    const subject = subjectsData.find(s => s.id === subjectId);
    return subject ? subject.title : 'Άγνωστο';
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
          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Προφίλ'} />
          <AvatarFallback>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
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
                    {subjectsData.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.title}
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
                
                {/* Λύκειο */}
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
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Η ενότητα Μαθητές είναι υπό κατασκευή.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Στατιστικά</CardTitle>
              <CardDescription>
                Δείτε στατιστικά χρήσης και προόδου των μαθητών σας.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Η ενότητα Στατιστικά είναι υπό κατασκευή.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
