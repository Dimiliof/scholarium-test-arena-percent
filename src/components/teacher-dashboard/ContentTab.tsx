
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subjects, QuizQuestion } from '@/lib/subjectsData';
import { RefreshCw, PlusCircle, Search, Eye, Edit, Share, ArrowUpDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';

// Ορισμός τύπων για τα δεδομένα
interface TeacherContent {
  id: number;
  question: string;
  subjectId: string;
  quizType: string;
  dateAdded: string;
}

interface ContentTabProps {
  isLoading: boolean;
  content: TeacherContent[];
  searchQuery: string;
  selectedSubject: string;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string) => void;
  refreshContent?: () => void;
  formatDate?: (date: string) => string;
}

const ContentTab: React.FC<ContentTabProps> = ({ 
  isLoading, 
  content, 
  searchQuery, 
  selectedSubject, 
  setSearchQuery, 
  setSelectedSubject,
  refreshContent,
  formatDate = (date) => date
}) => {
  const navigate = useNavigate();
  const { getQuestions, editQuestion } = useQuestionManagement();
  const [editingItem, setEditingItem] = useState<TeacherContent | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredContent = content.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
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

  const handleEditOpen = (item: TeacherContent) => {
    setEditingItem(item);
    setEditedQuestion(item.question);
  };

  const handleEditSave = () => {
    if (!editingItem) return;

    try {
      // Βρίσκουμε τις πλήρεις λεπτομέρειες της ερώτησης
      const questions = getQuestions(editingItem.subjectId, editingItem.quizType as any);
      const fullQuestion = questions.find(q => q.id === editingItem.id);
      
      if (fullQuestion) {
        // Ενημερώνουμε την ερώτηση και την αποθηκεύουμε
        const updatedQuestion = {
          ...fullQuestion,
          question: editedQuestion
        };
        
        editQuestion(editingItem.subjectId, updatedQuestion, editingItem.quizType as any);
        
        // Ενημερώνουμε τον χρήστη
        toast.success("Η ερώτηση ενημερώθηκε επιτυχώς!");
        
        // Ανανεώνουμε το περιεχόμενο
        if (refreshContent) {
          refreshContent();
        }
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επεξεργασία:", error);
      toast.error("Υπήρξε σφάλμα κατά την επεξεργασία της ερώτησης.");
    }
    
    setEditingItem(null);
  };

  const handleViewQuestion = (item: TeacherContent) => {
    navigate(`/quiz/${item.subjectId}/${item.quizType}?preview=true&questionId=${item.id}`);
  };

  const handleShareQuestion = (item: TeacherContent) => {
    // Δημιουργούμε ένα σύνδεσμο προεπισκόπησης της ερώτησης
    const shareUrl = `${window.location.origin}/quiz/${item.subjectId}/${item.quizType}?preview=true&questionId=${item.id}`;
    
    // Αντιγράφουμε το σύνδεσμο στο πρόχειρο
    navigator.clipboard.writeText(shareUrl);
    
    toast.success("Ο σύνδεσμος αντιγράφηκε στο πρόχειρο", {
      description: "Μπορείτε να μοιραστείτε αυτόν τον σύνδεσμο με τους μαθητές σας."
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Το περιεχόμενό μου</CardTitle>
          <CardDescription>
            Διαχειριστείτε τις ερωτήσεις και τα κουίζ που έχετε δημιουργήσει.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Αναζήτηση ερωτήσεων..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Όλα τα μαθήματα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα τα μαθήματα</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            className="md:ml-auto" 
            onClick={refreshContent}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Ανανέωση
          </Button>
          
          <Button onClick={() => navigate('/add-content')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Προσθήκη Περιεχομένου
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Φόρτωση...</p>
              </div>
            ) : filteredContent.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={toggleSortOrder}>
                      <div className="flex items-center">
                        ID <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Ερώτηση</TableHead>
                    <TableHead>Μάθημα</TableHead>
                    <TableHead>Τύπος Κουίζ</TableHead>
                    <TableHead>Ημ/νία Προσθήκης</TableHead>
                    <TableHead className="text-right">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="max-w-md truncate">{item.question}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getSubjectName(item.subjectId)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getQuizTypeName(item.quizType)}</TableCell>
                      <TableCell>{formatDate(item.dateAdded)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewQuestion(item)}
                            title="Προβολή ερώτησης"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOpen(item)}
                                title="Επεξεργασία ερώτησης"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Επεξεργασία Ερώτησης</DialogTitle>
                                <DialogDescription>
                                  Τροποποιήστε την ερώτηση παρακάτω.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="question">Ερώτηση</Label>
                                  <Textarea
                                    id="question"
                                    value={editedQuestion}
                                    onChange={(e) => setEditedQuestion(e.target.value)}
                                    rows={5}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label>Μάθημα</Label>
                                    <div className="mt-1.5">
                                      {editingItem && getSubjectName(editingItem.subjectId)}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Τύπος Κουίζ</Label>
                                    <div className="mt-1.5">
                                      {editingItem && getQuizTypeName(editingItem.quizType)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingItem(null)}>
                                  Ακύρωση
                                </Button>
                                <Button onClick={handleEditSave}>
                                  Αποθήκευση
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShareQuestion(item)}
                            title="Κοινοποίηση ερώτησης"
                          >
                            <Share className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default ContentTab;
