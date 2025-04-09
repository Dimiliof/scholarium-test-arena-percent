
import { useState } from 'react';
import { QuizQuestion, sampleQuestions } from '@/lib/subjectsData';
import { toast } from 'sonner';
import { QuizType } from '@/components/AddQuestionForm';

interface QuestionManagementResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: QuizType) => void;
  deleteQuestion: (subjectId: string, questionId: number, quizType: QuizType) => void;
  editQuestion: (subjectId: string, question: QuizQuestion, quizType: QuizType, oldQuizType?: QuizType) => void;
  getQuestions: (subjectId: string, quizType: QuizType) => QuizQuestion[];
  isLoading: boolean;
}

export function useQuestionManagement(): QuestionManagementResult {
  const [isLoading, setIsLoading] = useState(false);
  
  const addQuestion = (subjectId: string, question: QuizQuestion, quizType: QuizType) => {
    setIsLoading(true);
    
    try {
      const storageKey = `quiz_${subjectId}_${quizType}`;
      let existingQuestions = [];
      
      const storedQuestions = localStorage.getItem(storageKey);
      if (storedQuestions) {
        try {
          existingQuestions = JSON.parse(storedQuestions);
        } catch (e) {
          console.error("Σφάλμα κατά την ανάγνωση των αποθηκευμένων ερωτήσεων:", e);
          existingQuestions = [];
        }
      }
      
      existingQuestions.push(question);
      
      localStorage.setItem(storageKey, JSON.stringify(existingQuestions));
      
      if (!sampleQuestions[subjectId]) {
        sampleQuestions[subjectId] = [];
      }
      
      sampleQuestions[subjectId].push(question);
      
      console.log(`Ερώτηση προστέθηκε στο μάθημα ${subjectId} και τύπο ${quizType}:`, question);
      console.log(`Συνολικές ερωτήσεις για ${subjectId}:`, sampleQuestions[subjectId]);
      console.log(`Αποθηκεύτηκε στο localStorage με κλειδί: ${storageKey}`);
      
      toast.success("Η ερώτηση προστέθηκε επιτυχώς!", {
        description: `Η ερώτηση προστέθηκε επιτυχώς στο ${quizType} του μαθήματος και θα εμφανίζεται στον πίνακα του εκπαιδευτικού.`,
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

  const deleteQuestion = (subjectId: string, questionId: number, quizType: QuizType) => {
    setIsLoading(true);
    
    try {
      const storageKey = `quiz_${subjectId}_${quizType}`;
      
      const storedQuestions = localStorage.getItem(storageKey);
      if (storedQuestions) {
        let questions: QuizQuestion[] = JSON.parse(storedQuestions);
        
        questions = questions.filter(q => q.id !== questionId);
        
        localStorage.setItem(storageKey, JSON.stringify(questions));
        
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

  const editQuestion = (subjectId: string, question: QuizQuestion, quizType: QuizType, oldQuizType?: QuizType) => {
    setIsLoading(true);
    
    try {
      if (oldQuizType && oldQuizType !== quizType) {
        deleteQuestion(subjectId, question.id, oldQuizType);
      }
      
      const storageKey = `quiz_${subjectId}_${quizType}`;
      
      const storedQuestions = localStorage.getItem(storageKey);
      let questions: QuizQuestion[] = [];
      
      if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
        
        const existingIndex = questions.findIndex(q => q.id === question.id);
        
        if (existingIndex !== -1) {
          questions[existingIndex] = question;
        } else {
          questions.push(question);
        }
      } else {
        questions = [question];
      }
      
      localStorage.setItem(storageKey, JSON.stringify(questions));
      
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

  const getQuestions = (subjectId: string, quizType: QuizType): QuizQuestion[] => {
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
