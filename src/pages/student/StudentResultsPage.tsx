
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { subjects } from '@/lib/subjectsData';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Award, Search, TrendingUp, BarChart } from 'lucide-react';
import { toast } from 'sonner';

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

const quizTypeLabels: Record<string, string> = {
  'basic': 'Βασικές Ασκήσεις',
  'intermediate': 'Ενδιάμεσες Ασκήσεις',
  'advanced': 'Προχωρημένες Ασκήσεις',
  'quick': 'Διαγώνισμα 15 λεπτών',
  'medium': 'Διαγώνισμα 30 λεπτών',
  'full': 'Διαγώνισμα Εφ\' Όλης της Ύλης',
};

const StudentResultsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || 'all');
  const [selectedQuizType, setSelectedQuizType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    loadResults();
  }, [user?.id]);
  
  const loadResults = () => {
    setIsLoading(true);
    
    // Για λόγους επίδειξης, δημιουργούμε κάποια προσωρινά αποτελέσματα
    const mockResults: StudentResult[] = [
      {
        id: 1,
        studentId: user?.id || 0,
        studentName: user?.firstName + ' ' + user?.lastName || 'Ανώνυμος Μαθητής',
        subjectId: 'mathematics',
        quizType: 'basic',
        score: 8,
        maxScore: 10,
        dateCompleted: '15/09/2024'
      },
      {
        id: 2,
        studentId: user?.id || 0,
        studentName: user?.firstName + ' ' + user?.lastName || 'Ανώνυμος Μαθητής',
        subjectId: 'mathematics',
        quizType: 'intermediate',
        score: 7,
        maxScore: 10,
        dateCompleted: '20/09/2024'
      },
      {
        id: 3,
        studentId: user?.id || 0,
        studentName: user?.firstName + ' ' + user?.lastName || 'Ανώνυμος Μαθητής',
        subjectId: 'physics',
        quizType: 'basic',
        score: 9,
        maxScore: 10,
        dateCompleted: '18/09/2024'
      },
      {
        id: 4,
        studentId: user?.id || 0,
        studentName: user?.firstName + ' ' + user?.lastName || 'Ανώνυμος Μαθητής',
        subjectId: 'literature',
        quizType: 'full',
        score: 14,
        maxScore: 15,
        dateCompleted: '22/09/2024'
      },
      {
        id: 5,
        studentId: user?.id || 0,
        studentName: user?.firstName + ' ' + user?.lastName || 'Ανώνυμος Μαθητής',
        subjectId: 'mathematics',
        quizType: 'medium',
        score: 9,
        maxScore: 10,
        dateCompleted: '21/09/2024'
      }
    ];
    
    // Αποθήκευση των δεδομένων στο localStorage αν δεν υπάρχουν
    const storageKey = `student_results_${user?.id || 'guest'}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(mockResults));
    }
    
    // Φόρτωση των δεδομένων από το localStorage
    const storedResults = localStorage.getItem(storageKey);
    if (storedResults) {
      try {
        const parsedResults: StudentResult[] = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (e) {
        console.error("Σφάλμα κατά την ανάγνωση των αποτελεσμάτων:", e);
        setResults([]);
        toast.error("Σφάλμα κατά τη φόρτωση των αποτελεσμάτων");
      }
    } else {
      setResults(mockResults);
    }
    
    setIsLoading(false);
  };
  
  const filteredResults = results.filter(result => {
    const matchesSubject = selectedSubject === 'all' || result.subjectId === selectedSubject;
    const matchesQuizType = selectedQuizType === 'all' || result.quizType === selectedQuizType;
    const matchesSearch = quizTypeLabels[result.quizType]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getSubjectName(result.subjectId).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSubject && matchesQuizType && (searchTerm === '' || matchesSearch);
  });
  
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο μάθημα';
  };
  
  const calculateAverageScore = (subjectId: string = 'all') => {
    const relevantResults = subjectId === 'all' 
      ? results 
      : results.filter(r => r.subjectId === subjectId);
    
    if (relevantResults.length === 0) return 0;
    
    const totalPercentage = relevantResults.reduce((sum, result) => {
      return sum + (result.score / result.maxScore);
    }, 0);
    
    return Math.round((totalPercentage / relevantResults.length) * 100);
  };
  
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore;
    if (percentage >= 0.85) return 'text-green-600';
    if (percentage >= 0.7) return 'text-blue-600';
    if (percentage >= 0.5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getBestSubject = () => {
    const subjectScores = subjects.map(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id);
      if (subjectResults.length === 0) return { subjectId: subject.id, avgScore: 0 };
      
      const totalPercentage = subjectResults.reduce((sum, result) => {
        return sum + (result.score / result.maxScore);
      }, 0);
      
      return {
        subjectId: subject.id,
        avgScore: totalPercentage / subjectResults.length
      };
    });
    
    subjectScores.sort((a, b) => b.avgScore - a.avgScore);
    if (subjectScores.length === 0 || subjectScores[0].avgScore === 0) return null;
    
    return {
      subjectId: subjectScores[0].subjectId,
      avgScore: subjectScores[0].avgScore
    };
  };
  
  const bestSubject = getBestSubject();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Τα Αποτελέσματά μου</h1>
            <p className="text-muted-foreground">Δείτε τις βαθμολογίες σας από τα τεστ και τα διαγωνίσματα</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  Συνολική Επίδοση
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold mb-1 text-primary">{calculateAverageScore()}%</div>
                  <p className="text-sm text-muted-foreground">Μέσος όρος όλων των τεστ</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Συνολικά Τεστ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold mb-1 text-primary">{results.length}</div>
                  <p className="text-sm text-muted-foreground">Ολοκληρωμένα τεστ και διαγωνίσματα</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Καλύτερη Επίδοση
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {bestSubject ? (
                    <>
                      <div className="text-4xl font-bold mb-1 text-primary">
                        {Math.round(bestSubject.avgScore * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getSubjectName(bestSubject.subjectId)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl font-bold mb-1 text-gray-400">-</div>
                      <p className="text-sm text-muted-foreground">Δεν υπάρχουν επιδόσεις</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
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
                  <label className="text-sm font-medium">Τύπος Τεστ</label>
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      className="pl-10" 
                      placeholder="Αναζήτηση..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>Λίστα με όλα τα αποτελέσματά σας</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Μάθημα</TableHead>
                    <TableHead>Τύπος Τεστ</TableHead>
                    <TableHead>Βαθμολογία</TableHead>
                    <TableHead>Ημερομηνία</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">Φόρτωση αποτελεσμάτων...</TableCell>
                    </TableRow>
                  ) : filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Award className="h-8 w-8 text-muted-foreground" />
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
                        <TableCell className="font-medium">{getSubjectName(result.subjectId)}</TableCell>
                        <TableCell>{quizTypeLabels[result.quizType] || result.quizType}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getScoreColor(result.score, result.maxScore)}`}>
                            {result.score}/{result.maxScore} ({Math.round(result.score / result.maxScore * 100)}%)
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentResultsPage;
