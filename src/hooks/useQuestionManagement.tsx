
import { useState } from 'react';
import { QuizQuestion, sampleQuestions } from '@/lib/subjectsData';
import { toast } from 'sonner';

interface QuestionManagementResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: string) => void;
  deleteQuestion: (subjectId: string, questionId: number, quizType: string) => void;
  editQuestion: (subjectId: string, question: QuizQuestion, quizType: string, oldQuizType?: string) => void;
  getQuestions: (subjectId: string, quizType: string) => QuizQuestion[];
  isLoading: boolean;
}

export function useQuestionManagement(): QuestionManagementResult {
  const [isLoading, setIsLoading] = useState(false);
  
  const addQuestion = (subjectId: string, question: QuizQuestion, quizType: string) => {
    setIsLoading(true);
    
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
      
      // Εμφάνιση μηνύματος επιτυχίας
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
      setIsLoading(false);
    }
  };

  const deleteQuestion = (subjectId: string, questionId: number, quizType: string) => {
    setIsLoading(true);
    
    try {
      const storageKey = `quiz_${subjectId}_${quizType}`;
      
      // Ανάκτηση ερωτήσεων από το localStorage
      const storedQuestions = localStorage.getItem(storageKey);
      if (storedQuestions) {
        let questions: QuizQuestion[] = JSON.parse(storedQuestions);
        
        // Αφαίρεση της ερώτησης
        questions = questions.filter(q => q.id !== questionId);
        
        // Αποθήκευση στο localStorage
        localStorage.setItem(storageKey, JSON.stringify(questions));
        
        // Ενημέρωση των sampleQuestions
        if (sampleQuestions[subjectId]) {
          sampleQuestions[subjectId] = sampleQuestions[subjectId].filter(q => q.id !== questionId);
        }
        
        toast.success("Η ερώτηση διαγράφηκε επιτυχώς!");
      }
    } catch (error) {
      console.error("Σφάλμα κατά τη διαγραφή ερώτησης:", error);
      toast.error("Σφάλμα!", {
        description: "Υπήρξε ένα πρόβλημα κατά τη διαγραφή της ερώτησης.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editQuestion = (subjectId: string, question: QuizQuestion, quizType: string, oldQuizType?: string) => {
    setIsLoading(true);
    
    try {
      // Εάν έχει αλλάξει ο τύπος του κουίζ, πρέπει να διαγράψουμε την ερώτηση από τον παλιό τύπο
      if (oldQuizType && oldQuizType !== quizType) {
        deleteQuestion(subjectId, question.id, oldQuizType);
      }
      
      const storageKey = `quiz_${subjectId}_${quizType}`;
      
      // Ανάκτηση ερωτήσεων από το localStorage
      const storedQuestions = localStorage.getItem(storageKey);
      let questions: QuizQuestion[] = [];
      
      if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
        
        // Έλεγχος αν η ερώτηση υπάρχει ήδη
        const existingIndex = questions.findIndex(q => q.id === question.id);
        
        if (existingIndex !== -1) {
          // Ενημέρωση υπάρχουσας ερώτησης
          questions[existingIndex] = question;
        } else {
          // Προσθήκη νέας ερώτησης
          questions.push(question);
        }
      } else {
        // Καμία υπάρχουσα ερώτηση, προσθήκη της πρώτης
        questions = [question];
      }
      
      // Αποθήκευση στο localStorage
      localStorage.setItem(storageKey, JSON.stringify(questions));
      
      // Ενημέρωση των sampleQuestions
      if (!sampleQuestions[subjectId]) {
        sampleQuestions[subjectId] = [];
      }
      
      const sampleIndex = sampleQuestions[subjectId].findIndex(q => q.id === question.id);
      if (sampleIndex !== -1) {
        sampleQuestions[subjectId][sampleIndex] = question;
      } else {
        sampleQuestions[subjectId].push(question);
      }
      
      toast.success("Η ερώτηση ενημερώθηκε επιτυχώς!");
    } catch (error) {
      console.error("Σφάλμα κατά την επεξεργασία ερώτησης:", error);
      toast.error("Σφάλμα!", {
        description: "Υπήρξε ένα πρόβλημα κατά την επεξεργασία της ερώτησης.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestions = (subjectId: string, quizType: string): QuizQuestion[] => {
    try {
      const storageKey = `quiz_${subjectId}_${quizType}`;
      const storedQuestions = localStorage.getItem(storageKey);
      
      if (storedQuestions) {
        return JSON.parse(storedQuestions);
      }
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση ερωτήσεων:", error);
    }
    
    return [];
  };

  return { addQuestion, deleteQuestion, editQuestion, getQuestions, isLoading };
}
