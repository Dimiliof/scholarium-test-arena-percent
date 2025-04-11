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
  correctAnswer: number; // Changed to number to fix type errors
  image?: string;
  explanation?: string;
}

// Sample questions data by subject ID
export const sampleQuestions: Record<string, QuizQuestion[]> = {
  'mathematics': [
    {
      id: 1,
      question: 'Πόσο κάνει 2 + 2;',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Ποια είναι η τετραγωνική ρίζα του 9;',
      options: ['2', '3', '4', '9'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Πόσες μοίρες έχει ένα τρίγωνο;',
      options: ['90 μοίρες', '180 μοίρες', '270 μοίρες', '360 μοίρες'],
      correctAnswer: 1
    }
  ],
  'physics': [
    {
      id: 1,
      question: 'Ποια είναι η βασική μονάδα μέτρησης του χρόνου;',
      options: ['Λεπτό', 'Ώρα', 'Δευτερόλεπτο', 'Ημέρα'],
      correctAnswer: 2
    },
    {
      id: 2,
      question: 'Ποιος νόμος του Νεύτωνα αναφέρεται στη δράση και αντίδραση;',
      options: ['Πρώτος', 'Δεύτερος', 'Τρίτος', 'Τέταρτος'],
      correctAnswer: 2
    }
  ],
  'word': [
    {
      id: 1,
      question: 'Πώς εισάγουμε έναν πίνακα στο Word;',
      options: ['Insert > Table', 'Format > Table', 'View > Table', 'Home > Table'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Ποιο είναι το συντομευτικό πλήκτρο για την αποθήκευση ενός εγγράφου;',
      options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+O', 'Ctrl+N'],
      correctAnswer: 1
    }
  ],
  'excel': [
    {
      id: 1,
      question: 'Πώς αναφερόμαστε σε ένα κελί με σταθερή διεύθυνση;',
      options: ['Με το $', 'Με το #', 'Με το @', 'Με το &'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Ποια συνάρτηση χρησιμοποιούμε για να βρούμε τη μέγιστη τιμή;',
      options: ['MAX()', 'SUM()', 'COUNT()', 'AVERAGE()'],
      correctAnswer: 0
    }
  ],
  'powerpoint': [
    {
      id: 1,
      question: 'Πώς προσθέτουμε μια νέα διαφάνεια;',
      options: ['Insert > New Slide', 'Home > New Slide', 'File > New Slide', 'View > New Slide'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Πώς ξεκινάμε την παρουσίαση από την αρχή;',
      options: ['F1', 'F5', 'F9', 'F12'],
      correctAnswer: 1
    }
  ],
  'ancient-greek-language': [
    {
      id: 1,
      question: 'Ποιο από τα παρακάτω είναι σωστό;',
      options: ['Κλίσις ὁριστικῆς ἐνεργητικοῦ ἀορίστου', 'Κλίσις ὁριστικῆς ἐνεργητικοῦ παρατατικοῦ', 'Κλίσις ὁριστικῆς ἐνεργητικοῦ μέλλοντα', 'Κλίσις ὁριστικῆς μέσου ἀορίστου'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Ποια είναι η σωστή μετάφραση της φράσης "γνῶθι σαυτόν";',
      options: ['Να είσαι καλός άνθρωπος', 'Γνώριζε τον εαυτό σου', 'Μάθε γράμματα', 'Να αγαπάς τον πλησίον σου'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Τι μέρος του λόγου είναι το "ἐγώ";',
      options: ['Ρήμα', 'Επίθετο', 'Αντωνυμία', 'Επίρρημα'],
      correctAnswer: 2
    },
    {
      id: 4,
      question: 'Ποια είναι η γενική ενικού του "ἄνθρωπος";',
      options: ['ἀνθρώπου', 'ἀνθρώπῳ', 'ἄνθρωπον', 'ἄνθρωποι'],
      correctAnswer: 0
    },
    {
      id: 5,
      question: 'Ποιο χρονικό επίρρημα δηλώνει το παρελθόν;',
      options: ['νῦν', 'τότε', 'ἔπειτα', 'ἀεί'],
      correctAnswer: 1
    }
  ]
};

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
    name: 'Αρχαία Ελληνική Γραμματ��ία', 
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
