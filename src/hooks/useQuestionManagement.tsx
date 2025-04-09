import { useState } from 'react';
import { QuizQuestion } from '@/lib/subjectsData';
import { toast } from 'sonner';
import { QuizType } from '@/components/AddQuestionForm';

export interface ResourceType {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'pdf' | 'link' | 'development' | 'book' | 'video';
  url: string;
  subject: string;
  gradeLevel: string;
  isPublic: boolean;
  authorName: string;
  authorEmail: string;
  dateAdded: string;
  downloads: number;
  responses?: any[];
}

export interface QuizResult {
  studentId: string;
  studentName: string;
  subjectId: string;
  quizType: QuizType;
  score: number;
  totalQuestions: number;
  date: string;
  answers: number[];
}

interface QuestionManagementResult {
  addQuestion: (subjectId: string, question: QuizQuestion, quizType: QuizType) => void;
  deleteQuestion: (subjectId: string, questionId: number, quizType: QuizType) => void;
  editQuestion: (subjectId: string, question: QuizQuestion, quizType: QuizType, oldQuizType?: QuizType) => void;
  getQuestions: (subjectId: string, quizType: QuizType) => QuizQuestion[];
  saveQuizResult: (studentId: string, studentName: string, subjectId: string, quizType: QuizType, score: number, totalQuestions: number, answers: number[]) => void;
  getQuizResults: (subjectId: string, quizType: QuizType) => QuizResult[];
  getTeacherQuizResults: (teacherId: string) => QuizResult[];
  addResource: (resource: Omit<ResourceType, 'id' | 'dateAdded' | 'downloads'>) => string;
  getResources: (subjectId?: string) => ResourceType[];
  getResourceById: (resourceId: string) => ResourceType | undefined;
  addResourceResponse: (resourceId: string, response: any) => void;
  generateShareableLink: (resourceId: string) => string;
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
      
      console.log(`Ερώτηση προστέθηκε στο μάθημα ${subjectId} και τύπο ${quizType}:`, question);
      console.log(`Συνολικές ερωτήσεις για ${subjectId}:`, existingQuestions.length);
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

  const saveQuizResult = (studentId: string, studentName: string, subjectId: string, quizType: QuizType, score: number, totalQuestions: number, answers: number[]) => {
    try {
      const storageKey = 'quiz_results';
      let existingResults: QuizResult[] = [];
      
      const storedResults = localStorage.getItem(storageKey);
      if (storedResults) {
        existingResults = JSON.parse(storedResults);
      }
      
      const newResult: QuizResult = {
        studentId,
        studentName,
        subjectId,
        quizType,
        score,
        totalQuestions,
        date: new Date().toISOString(),
        answers
      };
      
      existingResults.push(newResult);
      localStorage.setItem(storageKey, JSON.stringify(existingResults));
      
      toast.success("Τα αποτελέσματα αποθηκεύτηκαν επιτυχώς!");
      
      return newResult;
    } catch (error) {
      console.error("Σφάλμα κατά την αποθήκευση αποτελεσμάτων:", error);
      toast.error("Σφάλμα κατά την αποθήκευση αποτελεσμάτων");
      return null;
    }
  };

  const getQuizResults = (subjectId: string, quizType: QuizType): QuizResult[] => {
    try {
      const storageKey = 'quiz_results';
      const storedResults = localStorage.getItem(storageKey);
      
      if (!storedResults) return [];
      
      const results: QuizResult[] = JSON.parse(storedResults);
      return results.filter(result => result.subjectId === subjectId && result.quizType === quizType);
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση αποτελεσμάτων:", error);
      return [];
    }
  };

  const getTeacherQuizResults = (teacherId: string): QuizResult[] => {
    try {
      const storageKey = 'quiz_results';
      const storedResults = localStorage.getItem(storageKey);
      
      if (!storedResults) return [];
      
      return JSON.parse(storedResults);
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση αποτελεσμάτων εκπαιδευτικού:", error);
      return [];
    }
  };

  const addResource = (resource: Omit<ResourceType, 'id' | 'dateAdded' | 'downloads'>): string => {
    setIsLoading(true);
    
    try {
      const storageKey = 'educational_resources';
      let existingResources: ResourceType[] = [];
      
      const storedResources = localStorage.getItem(storageKey);
      if (storedResources) {
        existingResources = JSON.parse(storedResources);
      }
      
      const resourceId = `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newResource: ResourceType = {
        ...resource,
        id: resourceId,
        dateAdded: new Date().toISOString().split('T')[0],
        downloads: 0,
        responses: []
      };
      
      existingResources.push(newResource);
      localStorage.setItem(storageKey, JSON.stringify(existingResources));
      
      toast.success("Ο εκπαιδευτικός πόρος προστέθηκε επιτυχώς!");
      
      return resourceId;
    } catch (error) {
      console.error("Σφάλμα κατά την προσθήκη πόρου:", error);
      toast.error("Σφάλμα κατά την προσθήκη του εκπαιδευτικού πόρου");
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const getResources = (subjectId?: string): ResourceType[] => {
    try {
      const storageKey = 'educational_resources';
      const storedResources = localStorage.getItem(storageKey);
      
      if (!storedResources) return [];
      
      const resources: ResourceType[] = JSON.parse(storedResources);
      
      if (subjectId) {
        return resources.filter(resource => resource.subject === subjectId);
      }
      
      return resources;
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση πόρων:", error);
      return [];
    }
  };

  const getResourceById = (resourceId: string): ResourceType | undefined => {
    try {
      const resources = getResources();
      return resources.find(resource => resource.id === resourceId);
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση πόρου:", error);
      return undefined;
    }
  };

  const addResourceResponse = (resourceId: string, response: any) => {
    try {
      const storageKey = 'educational_resources';
      const storedResources = localStorage.getItem(storageKey);
      
      if (!storedResources) return;
      
      const resources: ResourceType[] = JSON.parse(storedResources);
      const resourceIndex = resources.findIndex(r => r.id === resourceId);
      
      if (resourceIndex === -1) return;
      
      if (!resources[resourceIndex].responses) {
        resources[resourceIndex].responses = [];
      }
      
      resources[resourceIndex].responses!.push({
        ...response,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(storageKey, JSON.stringify(resources));
      
      toast.success("Η απάντησή σας υποβλήθηκε επιτυχώς!");
    } catch (error) {
      console.error("Σφάλμα κατά την προσθήκη απάντησης:", error);
      toast.error("Σφάλμα κατά την υποβολή της απάντησης");
    }
  };

  const generateShareableLink = (resourceId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/resources/${resourceId}`;
  };

  return { 
    addQuestion, 
    deleteQuestion, 
    editQuestion, 
    getQuestions, 
    saveQuizResult,
    getQuizResults,
    getTeacherQuizResults,
    addResource,
    getResources,
    getResourceById,
    addResourceResponse,
    generateShareableLink,
    isLoading 
  };
}
