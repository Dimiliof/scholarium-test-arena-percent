
import { useState } from 'react';
import { QuizQuestion } from '@/lib/subjectsData';
import { toast } from 'sonner';
import { QuizType } from '@/components/AddQuestionForm';

interface AddQuestionResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: QuizType) => void;
  isAdding: boolean;
}

export function useAddQuestion(): AddQuestionResult {
  const [isAdding, setIsAdding] = useState(false);
  
  const addQuestion = (subjectId: string, question: QuizQuestion, quizType: QuizType) => {
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
      
      console.log(`Ερώτηση προστέθηκε στο μάθημα ${subjectId} και τύπο ${quizType}:`, question);
      console.log(`Συνολικές ερωτήσεις για ${subjectId}:`, existingQuestions.length);
      
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
