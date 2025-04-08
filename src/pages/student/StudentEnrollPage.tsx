
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { subjects } from '@/lib/subjectsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type Subject = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subtitle?: string;
  teacherName?: string;
  isEnrolled?: boolean;
};

const StudentEnrollPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Φόρτωση τυχόν εγγεγραμμένων μαθημάτων από το localStorage
  React.useEffect(() => {
    setIsLoading(true);
    
    const storageKey = `enrolled_courses_${user?.id || 'guest'}`;
    const storedCourses = localStorage.getItem(storageKey);
    
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        setEnrolledCourses(parsedCourses.map((course: any) => course.subjectId));
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των εγγεγραμμένων μαθημάτων:", e);
      }
    }
    
    setIsLoading(false);
  }, [user?.id]);
  
  // Προσθήκη επιπλέον πληροφοριών στα μαθήματα
  const enhancedSubjects: Subject[] = subjects.map(subject => ({
    ...subject,
    teacherName: getTeacherName(subject.id),
    isEnrolled: enrolledCourses.includes(subject.id)
  }));
  
  // Φιλτράρισμα μαθημάτων με βάση τον όρο αναζήτησης
  const filteredSubjects = enhancedSubjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  function getTeacherName(subjectId: string): string {
    // Προσωρινή συνάρτηση που επιστρέφει ένα ψευδώνυμο καθηγητή ανάλογα με το μάθημα
    const teacherNames: Record<string, string> = {
      'mathematics': 'Δρ. Γεωργίου Μαρία',
      'physics': 'Δρ. Παπαδόπουλος Αντώνης',
      'literature': 'Δρ. Αθανασίου Ελένη',
      'chemistry': 'Δρ. Δημητρίου Νίκος',
      'biology': 'Δρ. Νικολάου Άννα',
      'history': 'Δρ. Ιωάννου Κώστας',
      'geography': 'Δρ. Παππά Σοφία'
    };
    
    return teacherNames[subjectId] || 'Άγνωστος Καθηγητής';
  }
  
  const handleEnroll = (subjectId: string) => {
    // Έλεγχος αν ο χρήστης είναι ήδη εγγεγραμμένος
    if (enrolledCourses.includes(subjectId)) {
      toast.error("Είστε ήδη εγγεγραμμένοι σε αυτό το μάθημα");
      return;
    }
    
    // Προσθήκη του νέου μαθήματος στη λίστα εγγεγραμμένων μαθημάτων
    const newEnrolledCourses = [...enrolledCourses, subjectId];
    setEnrolledCourses(newEnrolledCourses);
    
    // Δημιουργία νέας εγγραφής για το localStorage
    const storageKey = `enrolled_courses_${user?.id || 'guest'}`;
    const storedCoursesStr = localStorage.getItem(storageKey);
    let storedCourses = [];
    
    if (storedCoursesStr) {
      try {
        storedCourses = JSON.parse(storedCoursesStr);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των εγγεγραμμένων μαθημάτων:", e);
      }
    }
    
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) {
      toast.error("Το μάθημα δεν βρέθηκε");
      return;
    }
    
    // Προσθήκη νέου μαθήματος
    const newCourse = {
      id: Date.now().toString(),
      subjectId: subjectId,
      enrollDate: new Date().toLocaleDateString('el-GR'),
      status: 'active',
      progress: 0,
      lastActivity: new Date().toLocaleDateString('el-GR'),
      teacherName: getTeacherName(subjectId)
    };
    
    storedCourses.push(newCourse);
    localStorage.setItem(storageKey, JSON.stringify(storedCourses));
    
    toast.success(`Εγγραφήκατε επιτυχώς στο μάθημα ${subject.name}`);
    
    // Επισήμανση του μαθήματος ως εγγεγραμμένο
    const updatedSubjects = enhancedSubjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, isEnrolled: true };
      }
      return s;
    });
    
    // Εδώ χρειάζεται ανανέωση της σελίδας ή του state
    setTimeout(() => {
      navigate('/student/courses');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Εγγραφή σε Μαθήματα</h1>
              <p className="text-muted-foreground">Περιηγηθείτε και εγγραφείτε στα διαθέσιμα μαθήματα</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="relative max-w-md mx-auto md:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-10" 
                placeholder="Αναζήτηση μαθημάτων..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>Πληροφορία εγγραφής</AlertTitle>
            <AlertDescription>
              Επιλέξτε τα μαθήματα που σας ενδιαφέρουν και πατήστε το κουμπί "Εγγραφή" για να εγγραφείτε. 
              Μπορείτε να δείτε τα μαθήματα που έχετε εγγραφεί στη σελίδα "Τα μαθήματά μου".
            </AlertDescription>
          </Alert>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p>Φόρτωση μαθημάτων...</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Δεν βρέθηκαν μαθήματα</h2>
              <p className="text-muted-foreground mb-4">
                Δεν βρέθηκαν μαθήματα που να ταιριάζουν με τον όρο αναζήτησης.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Καθαρισμός φίλτρων
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map(subject => (
                <Card key={subject.id} className="overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${subject.imageUrl})` }}
                  />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{subject.name}</CardTitle>
                      {subject.isEnrolled && (
                        <Badge className="bg-green-500 text-white">
                          Εγγεγραμμένος
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Καθηγητής: {subject.teacherName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {subject.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50">
                    {subject.isEnrolled ? (
                      <Button className="w-full" variant="outline" disabled>
                        <Check className="h-4 w-4 mr-2" />
                        Ήδη εγγεγραμμένος
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleEnroll(subject.id)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Εγγραφή
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentEnrollPage;
