import { ReactNode } from 'react';
import {
  BookOpen,
  Book,
  FlaskConical,
  ScrollText,
  Landmark,
  Code,
  Music,
  Heart,
  Globe,
  Calculator,
  Dna,
  Lightbulb,
  BookText,
  Building,
  Infinity,
  PenTool,
  Palette,
  ActivitySquare,
  School,
  FileText,
  Table,
  BarChart
} from 'lucide-react';

// Subject interface for type safety
export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon: any;
  color: string;
  availableTests?: number;
  availableMaterials?: number;
}

// Quiz question interface
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  explanation?: string;
}

// Mock subjects data
export const subjects: Subject[] = [
  { 
    id: 'all', 
    name: 'Όλα τα μαθήματα', 
    icon: BookOpen, 
    color: 'bg-blue-500' 
  },
  { 
    id: 'ancient-greek-language', 
    name: 'Αρχαία Ελληνική Γλώσσα', 
    icon: ScrollText, 
    color: 'bg-purple-500' 
  },
  { 
    id: 'ancient-greek-literature', 
    name: 'Αρχαία Ελληνική Γραμματεία', 
    icon: BookText, 
    color: 'bg-purple-700' 
  },
  { 
    id: 'modern-greek-language', 
    name: 'Νεοελληνική Γλώσσα', 
    icon: PenTool, 
    color: 'bg-indigo-500' 
  },
  { 
    id: 'modern-greek-literature', 
    name: 'Νεοελληνική Γραμματεία', 
    icon: Book, 
    color: 'bg-indigo-700' 
  },
  { 
    id: 'history', 
    name: 'Ιστορία', 
    icon: Landmark, 
    color: 'bg-amber-600' 
  },
  { 
    id: 'religious-studies', 
    name: 'Θρησκευτικά', 
    icon: Building, 
    color: 'bg-blue-600' 
  },
  { 
    id: 'civics', 
    name: 'ΚΠΑ', 
    icon: School, 
    color: 'bg-green-600' 
  },
  { 
    id: 'mathematics', 
    name: 'Μαθηματικά', 
    icon: Calculator, 
    color: 'bg-green-500' 
  },
  { 
    id: 'chemistry', 
    name: 'Χημεία', 
    icon: FlaskConical, 
    color: 'bg-pink-500' 
  },
  { 
    id: 'physics', 
    name: 'Φυσική', 
    icon: Infinity, 
    color: 'bg-red-500' 
  },
  { 
    id: 'biology', 
    name: 'Βιολογία', 
    icon: Dna, 
    color: 'bg-emerald-500' 
  },
  { 
    id: 'word', 
    name: 'Microsoft Word', 
    description: 'Εκμάθηση επεξεργασίας κειμένου με το Microsoft Word',
    icon: FileText, 
    color: 'bg-blue-600',
    availableTests: 3,
    availableMaterials: 5
  },
  { 
    id: 'excel', 
    name: 'Microsoft Excel', 
    description: 'Εκμάθηση υπολογιστικών φύλλων με το Microsoft Excel',
    icon: Table, 
    color: 'bg-green-600',
    availableTests: 2,
    availableMaterials: 4
  },
  { 
    id: 'powerpoint', 
    name: 'Microsoft PowerPoint', 
    description: 'Δημιουργία παρουσιάσεων με το Microsoft PowerPoint',
    icon: BarChart, 
    color: 'bg-orange-600',
    availableTests: 2,
    availableMaterials: 3
  },
  { 
    id: 'technology', 
    name: 'Τεχνολογία', 
    icon: Code, 
    color: 'bg-slate-700' 
  },
  { 
    id: 'music', 
    name: 'Μουσική', 
    icon: Music, 
    color: 'bg-violet-500' 
  },
  { 
    id: 'emotional-education', 
    name: 'Συναισθηματική Αγωγή', 
    icon: Heart, 
    color: 'bg-red-400' 
  },
  { 
    id: 'geography', 
    name: 'Γεωγραφία', 
    icon: Globe, 
    color: 'bg-cyan-500' 
  },
  { 
    id: 'art', 
    name: 'Καλλιτεχνικά', 
    icon: Palette, 
    color: 'bg-orange-500' 
  },
  { 
    id: 'physical-education', 
    name: 'Φυσική Αγωγή', 
    icon: ActivitySquare, 
    color: 'bg-yellow-500' 
  },
  { 
    id: 'computer-science', 
    name: 'Πληροφορική', 
    icon: Code, 
    color: 'bg-indigo-500' 
  }
];

export const getSubject = (subjectId: string): Subject | undefined => {
  return subjects.find(subject => subject.id === subjectId);
};
