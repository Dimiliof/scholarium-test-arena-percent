
import { useState } from 'react';
import { QuizQuestion, sampleQuestions } from '@/lib/subjectsData';
import { toast } from 'sonner';

interface AddQuestionResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: string) => void;
  isAdding: boolean;
}

export function useAddQuestion(): AddQuestionResult {
  const [isAdding, setIsAdding] = useState(false);
  
  const addQuestion = (subjectId: string, question: QuizQuestion, quizType: string) => {
    setIsAdding(true);
    
    try {
      // Δημιουργία ή ανάκτηση των ερωτήσεων για το συγκεκριμένο μάθημα και τύπο κουίζ
      const storageKey = `quiz_${subjectId}_${quizType}`;
      let existingQuestions = [];
      
      // Έλεγχος αν υπάρχουν ήδη ερωτήσεις στο localStorage
      const storedQuestions = localStorage.getItem(storageKey);
      if (storedQuestions) {
        try {
          existingQuestions = JSON.parse(storedQuestions);
        } catch (e) {
          console.error("Σφάλμα κατά την ανάγνωση των αποθηκευμένων ερωτήσεων:", e);
          existingQuestions = [];
        }
      }
      
      // Προσθήκη της νέας ερώτησης
      existingQuestions.push(question);
      
      // Αποθήκευση στο localStorage
      localStorage.setItem(storageKey, JSON.stringify(existingQuestions));
      
      // Ενημέρωση των sampleQuestions για άμεση εμφάνιση στην εφαρμογή
      if (!sampleQuestions[subjectId]) {
        sampleQuestions[subjectId] = [];
      }
      
      // Προσθήκη της ερώτησης στο sampleQuestions
      sampleQuestions[subjectId].push(question);
      
      console.log(`Ερώτηση προστέθηκε στο μάθημα ${subjectId} και τύπο ${quizType}:`, question);
      console.log(`Συνολικές ερωτήσεις για ${subjectId}:`, sampleQuestions[subjectId]);
      
      // Εμφάνιση μηνύματος επιτυχίας χρησιμοποιώντας και το sonner toast
      toast.success("Η ερώτηση προστέθηκε επιτυχώς!", {
        description: `Η ερώτηση προστέθηκε επιτυχώς στο ${quizType} του μαθήματος.`,
        duration: 4000,
      });
      
    } catch (error) {
      console.error("Σφάλμα κατά την προσθήκη ερώτησης:", error);
      toast.error("Σφάλμα!", {
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη της ερώτησης.",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return { addQuestion, isAdding };
}
