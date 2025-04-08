
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, BookOpen, Filter } from 'lucide-react';
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

type TeacherContent = {
  id: number;
  question: string;
  subjectId: string;
  quizType: string;
  dateAdded: string;
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

  useEffect(() => {
    // Εδώ θα φορτώναμε το περιεχόμενο από το API ή το localStorage
    loadTeacherContent();
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

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Πίνακας Εκπαιδευτικού</h1>
            <p className="text-muted-foreground">Διαχειριστείτε τις ερωτήσεις και τα διαγωνίσματα που έχετε ανεβάσει</p>
          </div>
          
          <Button onClick={() => navigate('/add-content')} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Προσθήκη Νέας Ερώτησης</span>
          </Button>
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
