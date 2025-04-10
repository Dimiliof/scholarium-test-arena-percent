
import React from 'react';
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
import { RefreshCw, PlusCircle, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          
          <Button onClick={() => navigate('/add-content')} className="md:ml-auto">
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
                    <TableHead>Ερώτηση</TableHead>
                    <TableHead>Μάθημα</TableHead>
                    <TableHead>Τύπος Κουίζ</TableHead>
                    <TableHead>Ημ/νία Προσθήκης</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-md truncate">{item.question}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getSubjectName(item.subjectId)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getQuizTypeName(item.quizType)}</TableCell>
                      <TableCell>{formatDate(item.dateAdded)}</TableCell>
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
