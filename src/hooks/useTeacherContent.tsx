
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { subjects, QuizQuestion } from '@/lib/subjectsData';

export interface TeacherContent {
  id: number;
  question: string;
  subjectId: string;
  quizType: string;
  dateAdded: string;
}

export const useTeacherContent = () => {
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('content');

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
      console.log("Περιεχόμενο που φορτώθηκε:", allContent);
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του περιεχομένου:", error);
      toast.error("Σφάλμα κατά τη φόρτωση του περιεχομένου");
    } finally {
      setIsLoading(false);
    }
  };

  // Αυτόματη φόρτωση περιεχομένου κατά την αρχικοποίηση
  useEffect(() => {
    loadTeacherContent();
  }, []);

  const refreshContent = () => {
    loadTeacherContent();
    toast.success("Το περιεχόμενο ανανεώθηκε");
  };

  // Μορφοποίηση της ημερομηνίας σε ελληνική μορφή DD/MM/YYYY
  const formatDate = (date: string) => {
    if (!date) return '';
    
    try {
      const parts = date.split('/');
      if (parts.length === 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      
      // Αν δεν είναι ήδη στη μορφή DD/MM/YYYY, προσπαθούμε να το μετατρέψουμε
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return date;
      }
      
      return dateObj.toLocaleDateString('el-GR');
    } catch (error) {
      console.error("Σφάλμα κατά τη μορφοποίηση της ημερομηνίας:", error);
      return date;
    }
  };

  return {
    content,
    isLoading,
    searchQuery,
    selectedSubject,
    activeTab,
    loadTeacherContent,
    refreshContent,
    setSearchQuery,
    setSelectedSubject,
    setActiveTab,
    formatDate
  };
};
