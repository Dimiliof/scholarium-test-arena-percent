
import { useState } from 'react';
import { QuizQuestion, sampleQuestions } from '@/lib/subjectsData';

interface AddQuestionResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: string) => void;
  isAdding: boolean;
}

export function useAddQuestion(): AddQuestionResult {
  const [isAdding, setIsAdding] = useState(false);
  
  const addQuestion = (subjectId: string, question: QuizQuestion, quizType: string) => {
    setIsAdding(true);
    
    try {
      // Σε μια πραγματική εφαρμογή, εδώ θα στέλναμε τα δεδομένα σε μια βάση δεδομένων
      // Για τώρα απλά τα προσθέτουμε στο τοπικό state
      
      // Πρώτα δημιουργούμε αντίγραφο του υπάρχοντος array αν υπάρχει
      if (!sampleQuestions[subjectId]) {
        sampleQuestions[subjectId] = [];
      }
      
      // Προσθέτουμε την ερώτηση στο αντίγραφο
      sampleQuestions[subjectId].push(question);
      
      // Για αυτή την απλή υλοποίηση, αποθηκεύουμε τα δεδομένα στο localStorage
      localStorage.setItem(`quiz_${subjectId}_${quizType}`, JSON.stringify(sampleQuestions[subjectId]));
      
      console.log(`Ερώτηση προστέθηκε στο μάθημα ${subjectId} και τύπο ${quizType}:`, question);
    } catch (error) {
      console.error("Σφάλμα κατά την προσθήκη ερώτησης:", error);
    } finally {
      setIsAdding(false);
    }
  };
  
  return { addQuestion, isAdding };
}
