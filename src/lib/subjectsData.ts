import React from 'react';
import { ScrollText, Calculator, BookOpen, Landmark, Cross, Users, 
  FlaskConical, Atom, Leaf, Wrench, Music, Heart, Globe, Computer,
  FileText, FileSpreadsheet, FilePresentation } from 'lucide-react';

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
  ],
  'history': [
    {
      id: 1,
      question: 'Πότε έγινε η Άλωση της Κωνσταντινούπολης από τους Οθωμανούς;',
      options: ['1204', '1453', '1492', '1821'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Ποιος ήταν ο πρώτος κυβερνήτης της Ελλάδας μετά την Επανάσταση του 1821;',
      options: ['Θεόδωρος Κολοκοτρώνης', 'Ιωάννης Καποδίστριας', 'Όθωνας', 'Γεώργιος Καραϊσκάκης'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Ποια μάχη θεωρείται καθοριστική για την έκβαση ��ου Β΄ Παγκοσμίου Πολ��μου στην Ευρώπη;',
      options: ['Μάχη της Αγγλίας', 'Μάχη του Στάλινγκραντ', 'Μάχη των Αρδεννών', 'Απόβαση στη Νορμανδία'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Πότε έγινε η ένταξη της Ελλάδας στην Ευρωπαϊκή Οικονομική Κοινότητα (ΕΟΚ);',
      options: ['1974', '1981', '1992', '2001'],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'Ποιος ήταν ο ηγέτης της Οκτωβριανής Επανάστασης στη Ρωσία;',
      options: ['Λένιν', 'Στάλιν', 'Τρότσκι', 'Τσάρος Νικόλαος Β΄'],
      correctAnswer: 0
    }
  ],
  'modern-greek': [
    {
      id: 1,
      question: 'Ποιος έγραψε το ποίημα "Ελεύθεροι Πολιορκημένοι";',
      options: ['Κωστής Παλαμάς', 'Διονύσιος Σολωμός', 'Κωνσταντίνος Καβάφης', 'Οδυσσέας Ελύτης'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Τι είναι το κατηγορούμενο σε μια πρόταση;',
      options: [
        'Το πρόσωπο ή πράγμα που ενεργεί', 
        'Η λέξη που δέχεται την ενέργεια του ρήματος', 
        'Η λέξη που προσδιορίζει το υποκείμενο', 
        'Μια λέξη που προσδιορίζει το ρήμα'
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'Ποιο από τα παρακάτω δεν είναι είδος δευτερεύουσας πρότασης;',
      options: ['Αιτιολογική', 'Υποθετική', 'Αναφορική', 'Κύρια'],
      correctAnswer: 3
    }
  ],
  'physics': [
    {
      id: 1,
      question: 'Ποια είναι η μονάδα μέτρησης της δύναμης στο Διεθνές Σύστημα Μονάδων (SI);',
      options: ['Νιούτον (N)', 'Τζάουλ (J)', 'Βατ (W)', 'Πασκάλ (Pa)'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Ποιος διατύπωσε τη θεωρία της σχετικότητας;',
      options: ['Νεύτωνας', 'Αϊνστάιν', 'Γαλιλαίος', 'Μαξγουελ'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Τι μετράει η κλίμακα Ρίχτερ;',
      options: ['Την ένταση του ήχου', 'Το μέγεθος των σεισμών', 'Τη θερμοκρασία', 'Την ταχύτητα του ανέμου'],
      correctAnswer: 1
    }
  ],
  'ecdl-word': [
    {
      id: 1,
      question: 'Ποιο από τα παρακάτω πλήκτρα συντόμευσης χρησιμοποιείται για την αποθήκευση ενός εγγράφου στο Word;',
      options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+C', 'Ctrl+V'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Πώς μπορείτε να δημιουργήσετε έναν πίνακα περιεχομένων στο Word;',
      options: [
        'Με την εντολή Insert > Table of Contents', 
        'Με την εντολή References > Table of Contents', 
        'Με την εντολή View > Table of Contents', 
        'Με την εντολή Format > Table of Contents'
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Ποια είναι η συντόμευση για να κάνετε έντονη (bold) τη γραμματοσειρά;',
      options: ['Ctrl+I', 'Ctrl+B', 'Ctrl+U', 'Ctrl+A'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Πώς μπορείτε να εισάγετε αυτόματα αρίθμηση σελίδων σε ένα έγγραφο Word;',
      options: [
        'Insert > Page Number', 
        'Format > Page Number', 
        'References > Page Number', 
        'View > Page Number'
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: 'Ποια είναι η προεπιλεγμένη προβολή στο Word;',
      options: ['Print Layout', 'Web Layout', 'Draft', 'Outline'],
      correctAnswer: 0
    }
  ],
  'ecdl-excel': [
    {
      id: 1,
      question: 'Πώς αναφέρεται στο Excel μια απόλυτη αναφορά κελιού;',
      options: ['A1', '$A$1', 'A$1', '$A1'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Ποια συνάρτηση χρησιμοποιείται για το άθροισμα μιας περιοχής κελιών;',
      options: ['COUNT', 'SUM', 'AVERAGE', 'MAX'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Πώς μπορείτε να δημιουργήσετε ένα γράφημα στο Excel;',
      options: [
        'Insert > Chart', 
        'Format > Chart', 
        'Data > Chart', 
        'View > Chart'
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: 'Ποια συνάρτηση χρησιμοποιείται για να βρείτε τη μέγιστη τιμή σε μια περιοχή κελιών;',
      options: ['MAX', 'MAXIMUM', 'LARGE', 'TOP'],
      correctAnswer: 0
    },
    {
      id: 5,
      question: 'Τι κάνει η συνάρτηση VLOOKUP;',
      options: [
        'Αναζητά τιμές σε οριζόντιο πίνακα', 
        'Αναζητά τιμές σε κάθετο πίνακα', 
        'Υπολογίζει το μέσο όρο των τιμών', 
        'Μετράει τον αριθμό των κελιών με αριθμητικές τιμές'
      ],
      correctAnswer: 1
    }
  ],
  'ecdl-powerpoint': [
    {
      id: 1,
      question: 'Ποιο πλήκτρο συντόμευσης χρησιμοποιείται για την έναρξη μιας παρουσίασης από την αρχή;',
      options: ['F1', 'F5', 'F7', 'F9'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Πώς μπορείτε να προσθέσετε εφέ μετάβασης μεταξύ των διαφανειών;',
      options: [
        'Design > Transitions', 
        'Animations > Transitions', 
        'Transitions > Effects', 
        'Insert > Transitions'
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: 'Πώς ονομάζεται η προβολή στο PowerPoint που σας επιτρέπει να δείτε όλες τις διαφάνειες σε μικρογραφίες;',
      options: ['Normal View', 'Slide Sorter View', 'Reading View', 'Slide Show View'],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'Ποια εντολή χρησιμοποιείται για να εισάγετε μια νέα διαφάνεια;',
      options: [
        'Home > New Slide', 
        'Insert > New Slide', 
        'Design > New Slide', 
        'View > New Slide'
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: 'Ποιο από τα παρακάτω ΔΕΝ είναι διαθέσιμο εφέ κίνησης στο PowerPoint;',
      options: ['Entrance', 'Emphasis', 'Exit', 'Translation'],
      correctAnswer: 3
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
  },
  { 
    id: 'computer-science', 
    name: 'Πληροφορική', 
    icon: Computer, 
    color: 'bg-blue-700',
    description: 'Μελέτη των υπολογιστών, της επιστήμης των υπολογιστών και της τεχνολογίας πληροφοριών',
    availableTests: 30,
    availableMaterials: 55
  },
  { 
    id: 'ecdl-word', 
    name: 'ECDL Word', 
    icon: FileText, 
    color: 'bg-blue-600',
    description: 'Επεξεργασία κειμένου με το Microsoft Word',
    availableTests: 15,
    availableMaterials: 22
  },
  { 
    id: 'ecdl-excel', 
    name: 'ECDL Excel', 
    icon: FileSpreadsheet, 
    color: 'bg-green-600',
    description: 'Υπολογιστικά φύλλα με το Microsoft Excel',
    availableTests: 18,
    availableMaterials: 25
  },
  { 
    id: 'ecdl-powerpoint', 
    name: 'ECDL PowerPoint', 
    icon: FilePresentation, 
    color: 'bg-orange-500',
    description: 'Παρουσιάσεις με το Microsoft PowerPoint',
    availableTests: 12,
    availableMaterials: 20
  }
];
