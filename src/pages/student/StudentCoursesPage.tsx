import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen, GraduationCap, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { subjects } from '@/lib/subjectsData';
import { toast } from 'sonner';

type EnrolledCourse = {
  id: string;
  subjectId: string;
  enrollDate: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  lastActivity: string;
  teacherName: string;
};

const StudentCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnrolledCourses();
  }, [user?.id]);

  const loadEnrolledCourses = () => {
    setIsLoading(true);
    
    const mockCourses: EnrolledCourse[] = [
      {
        id: '1',
        subjectId: 'mathematics',
        enrollDate: '01/09/2024',
        status: 'active',
        progress: 65,
        lastActivity: '24/09/2024',
        teacherName: 'Δρ. Γεωργίου Μαρία'
      },
      {
        id: '2',
        subjectId: 'physics',
        enrollDate: '15/09/2024',
        status: 'active',
        progress: 42,
        lastActivity: '23/09/2024',
        teacherName: 'Δρ. Παπαδόπουλος Αντώνης'
      },
      {
        id: '3',
        subjectId: 'literature',
        enrollDate: '10/09/2024',
        status: 'completed',
        progress: 100,
        lastActivity: '22/09/2024',
        teacherName: 'Δρ. Αθανασίου Ελένη'
      }
    ];
    
    const storageKey = `enrolled_courses_${user?.id || 'guest'}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(mockCourses));
    }
    
    const storedCourses = localStorage.getItem(storageKey);
    if (storedCourses) {
      try {
        const parsedCourses: EnrolledCourse[] = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των εγγεγραμμένων μαθημάτων:", e);
        setCourses([]);
        toast.error("Σφάλμα κατά τη φόρτωση των μαθημάτων");
      }
    }
    
    setIsLoading(false);
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο μάθημα';
  };

  const getSubjectImage = (subjectId: string) => {
    return '/placeholder.svg';
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
      case 'active': return 'Ενεργό';
      case 'pending': return 'Σε εκκρεμότητα';
      case 'completed': return 'Ολοκληρωμένο';
      default: return 'Άγνωστο';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Τα Μαθήματα μου</h1>
              <p className="text-muted-foreground">Διαχειριστείτε τα μαθήματα στα οποία είστε εγγεγραμμένοι</p>
            </div>
            
            <Link to="/student/enroll">
              <Button className="mt-4 md:mt-0">
                <BookOpen className="h-4 w-4 mr-2" />
                Εγγραφή σε νέο μάθημα
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p>Φόρτωση μαθημάτων...</p>
            </div>
          ) : courses.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Δεν έχετε εγγραφεί σε μαθήματα</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Εγγραφείτε σε μαθήματα για να δείτε το περιεχόμενό τους, να συμμετέχετε σε 
                    διαγωνίσματα και να παρακολουθήσετε την πρόοδό σας.
                  </p>
                  <Link to="/student/enroll">
                    <Button size="lg">
                      Εγγραφή στο πρώτο σας μάθημα
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const subjectName = getSubjectName(course.subjectId);
                const subjectImage = getSubjectImage(course.subjectId);
                
                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${subjectImage})` }}
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{subjectName}</CardTitle>
                        <Badge className={`${getStatusColor(course.status)} text-white`}>
                          {getStatusLabel(course.status)}
                        </Badge>
                      </div>
                      <CardDescription>Καθηγητής: {course.teacherName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Πρόοδος</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Εγγραφή: {course.enrollDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Τελευταία δραστηριότητα: {course.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-between">
                      <Link to={`/subject/${course.subjectId}`}>
                        <Button variant="outline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Περιεχόμενο
                        </Button>
                      </Link>
                      
                      <Link to={`/student/results?subject=${course.subjectId}`}>
                        <Button>
                          Τα αποτελέσματά μου
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentCoursesPage;
