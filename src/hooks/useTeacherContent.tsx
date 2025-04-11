
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

  // Επεξεργασία περιεχομένου
  const editContent = (contentId: number, newQuestion: string) => {
    setIsLoading(true);
    
    try {
      // Εντοπίζουμε το περιεχόμενο που θέλουμε να επεξεργαστούμε
      const contentToEdit = content.find(c => c.id === contentId);
      
      if (!contentToEdit) {
        toast.error("Το περιεχόμενο δεν βρέθηκε");
        return;
      }
      
      // Φορτώνουμε όλες τις ερωτήσεις για το συγκεκριμένο μάθημα και τύπο κουίζ
      const storageKey = `quiz_${contentToEdit.subjectId}_${contentToEdit.quizType}`;
      const storedQuestions = localStorage.getItem(storageKey);
      
      if (storedQuestions) {
        const questions: QuizQuestion[] = JSON.parse(storedQuestions);
        
        // Βρίσκουμε και ενημερώνουμε την ερώτηση
        const updatedQuestions = questions.map(q => {
          if (q.id === contentId) {
            return {
              ...q,
              question: newQuestion
            };
          }
          return q;
        });
        
        // Αποθηκεύουμε τις ενημερωμένες ερωτήσεις
        localStorage.setItem(storageKey, JSON.stringify(updatedQuestions));
        
        // Ενημερώνουμε το state
        setContent(prevContent => 
          prevContent.map(c => 
            c.id === contentId 
              ? { ...c, question: newQuestion } 
              : c
          )
        );
        
        toast.success("Το περιεχόμενο ενημερώθηκε επιτυχώς");
      } else {
        toast.error("Δεν βρέθηκαν ερωτήσεις για το συγκεκριμένο μάθημα");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επεξεργασία του περιεχομένου:", error);
      toast.error("Σφάλμα κατά την επεξεργασία του περιεχομένου");
    } finally {
      setIsLoading(false);
    }
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
    editContent,
    setSearchQuery,
    setSelectedSubject,
    setActiveTab,
    formatDate
  };
};
