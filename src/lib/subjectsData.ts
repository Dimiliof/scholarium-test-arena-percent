
import React from 'react';
import { ScrollText, Calculator, BookOpen, Landmark, Cross, Users, 
  FlaskConical, Atom, Leaf, Wrench, Music, Heart, Globe } from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
  availableTests?: number;
  availableMaterials?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Definition of sample questions for each subject
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
      question: 'Ποιο είναι το εμβαδόν τετραγώνου με πλευρά 5 μονάδες;',
      options: ['15 τ.μ.', '20 τ.μ.', '25 τ.μ.', '30 τ.μ.'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'Ποιο είναι το αποτέλεσμα της πράξης 3 × 4 ÷ 2;',
      options: ['1', '6', '8', '12'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Πόσες μοίρες έχει ένα τρίγωνο;',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'Πόσο κάνει η τετραγωνική ρίζα του 16;',
      options: ['2', '4', '6', '8'],
      correctAnswer: 1
    }
  ],
  'ancient-greek-language': [
    {
      id: 1,
      question: 'Ποιος έγραψε την "Οδύσσεια";',
      options: ['Σοφοκλής', 'Όμηρος', 'Ευριπίδης', 'Αριστοτέλης'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Ποια από τις παρακάτω λέξεις είναι ρήμα στα αρχαία ελληνικά;',
      options: ['καλός', 'λόγος', 'γράφω', 'ἄνθρωπος'],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'Ποια είναι η σωστή μετάφραση της φράσης "οἶδα οὐδὲν εἰδώς";',
      options: [
        'Γνωρίζω χωρίς να έχω διδαχθεί', 
        'Γνωρίζω ότι δεν γνωρίζω τίποτα', 
        'Διδάσκω αυτά που γνωρίζω', 
        'Μαθαίνω συνεχώς καινούργια πράγματα'
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Ποια πτώση χρησιμοποιείται συνήθως για το υποκείμενο στα αρχαία ελληνικά;',
      options: ['Γενική', 'Δοτική', 'Αιτιατική', 'Ονομαστική'],
      correctAnswer: 3
    },
    {
      id: 5,
      question: 'Ποιος από τους παρακάτω δεν ήταν αρχαίος Έλληνας φιλόσοφος;',
      options: ['Πλάτων', 'Σωκράτης', 'Κικέρων', 'Αριστοτέλης'],
      correctAnswer: 2
    }
  ]
};

export const subjects: Subject[] = [
  { 
    id: 'ancient-greek-language', 
    name: 'Αρχαία Ελληνική Γλώσσα', 
    icon: ScrollText, 
    color: 'bg-purple-500',
    description: 'Μελέτη της αρχαίας ελληνικής γλώσσας και γραμματικής',
    availableTests: 25,
    availableMaterials: 50
  },
  { 
    id: 'mathematics', 
    name: 'Μαθηματικά', 
    icon: Calculator, 
    color: 'bg-green-500',
    description: 'Άλγεβρα, Γεωμετρία και Στατιστική',
    availableTests: 40,
    availableMaterials: 75
  },
  { 
    id: 'modern-greek', 
    name: 'Νεοελληνική Γλώσσα', 
    icon: BookOpen, 
    color: 'bg-blue-500',
    description: 'Γραμματική, συντακτικό και λογοτεχνία της νέας ελληνικής',
    availableTests: 30,
    availableMaterials: 60
  },
  { 
    id: 'history', 
    name: 'Ιστορία', 
    icon: Landmark, 
    color: 'bg-amber-500',
    description: 'Παγκόσμια και ελληνική ιστορία από την αρχαιότητα έως σήμερα',
    availableTests: 35,
    availableMaterials: 70
  },
  { 
    id: 'religion', 
    name: 'Θρησκευτικά', 
    icon: Cross, 
    color: 'bg-sky-500',
    description: 'Μελέτη θρησκειών με έμφαση στον Χριστιανισμό',
    availableTests: 20,
    availableMaterials: 40
  },
  { 
    id: 'civics', 
    name: 'ΚΠΑ', 
    icon: Users, 
    color: 'bg-indigo-500',
    description: 'Κοινωνική και Πολιτική Αγωγή',
    availableTests: 15,
    availableMaterials: 30
  },
  { 
    id: 'chemistry', 
    name: 'Χημεία', 
    icon: FlaskConical, 
    color: 'bg-rose-500',
    description: 'Μελέτη της σύστασης και των ιδιοτήτων της ύλης',
    availableTests: 28,
    availableMaterials: 45
  },
  { 
    id: 'physics', 
    name: 'Φυσική', 
    icon: Atom, 
    color: 'bg-cyan-500',
    description: 'Μελέτη της ύλης, της ενέργειας και των φυσικών φαινομένων',
    availableTests: 32,
    availableMaterials: 55
  },
  { 
    id: 'biology', 
    name: 'Βιολογία', 
    icon: Leaf, 
    color: 'bg-emerald-500',
    description: 'Μελέτη των ζωντανών οργανισμών και των λειτουργιών τους',
    availableTests: 27,
    availableMaterials: 50
  },
  { 
    id: 'technology', 
    name: 'Τεχνολογία', 
    icon: Wrench, 
    color: 'bg-slate-500',
    description: 'Εισαγωγή στις τεχνολογικές εξελίξεις και εφαρμογές',
    availableTests: 18,
    availableMaterials: 35
  },
  { 
    id: 'music', 
    name: 'Μουσική', 
    icon: Music, 
    color: 'bg-pink-500',
    description: 'Θεωρία της μουσικής και μουσικά όργανα',
    availableTests: 12,
    availableMaterials: 25
  },
  { 
    id: 'emotional-education', 
    name: 'Συναισθηματική Αγωγή', 
    icon: Heart, 
    color: 'bg-red-500',
    description: 'Ανάπτυξη συναισθηματικής νοημοσύνης και κοινωνικών δεξιοτήτων',
    availableTests: 10,
    availableMaterials: 20
  },
  { 
    id: 'geography', 
    name: 'Γεωγραφία', 
    icon: Globe, 
    color: 'bg-teal-500',
    description: 'Μελέτη της Γης, των εδαφών, των χαρακτηριστικών και των πληθυσμών της',
    availableTests: 22,
    availableMaterials: 40
  }
];
