
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
}

const ContentTab: React.FC<ContentTabProps> = ({ 
  isLoading, 
  content, 
  searchQuery, 
  selectedSubject, 
  setSearchQuery, 
  setSelectedSubject 
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
  );
};

export default ContentTab;
