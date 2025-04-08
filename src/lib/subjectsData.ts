
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  imageUrl?: string; // Adding optional imageUrl property
}

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Μαθηματικά",
    icon: "Pi",
    color: "bg-blue-500",
    description: "Εξερευνήστε τον κόσμο των αριθμών, των σχημάτων και των μοτίβων.",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "physics",
    name: "Φυσική",
    icon: "Atom",
    color: "bg-orange-500",
    description: "Ανακαλύψτε τις θεμελιώδεις αρχές που διέπουν το σύμπαν.",
    imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: "chemistry",
    name: "Χημεία",
    icon: "FlaskConical",
    color: "bg-green-500",
    description: "Κατανοήστε τη σύνθεση, τις ιδιότητες και τις αντιδράσεις της ύλης.",
    imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "biology",
    name: "Βιολογία",
    icon: "Dna",
    color: "bg-red-500",
    description: "Μελετήστε τη ζωή, από τα μικρόβια έως τα οικοσυστήματα.",
    imageUrl: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "history",
    name: "Ιστορία",
    icon: "Scroll",
    color: "bg-purple-500",
    description: "Ταξιδέψτε στο χρόνο και εξερευνήστε το παρελθόν.",
    imageUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: "geography",
    name: "Γεωγραφία",
    icon: "Globe",
    color: "bg-cyan-500",
    description: "Εξερευνήστε τον κόσμο και τις σχέσεις μεταξύ ανθρώπων και περιβάλλοντος.",
    imageUrl: "https://images.unsplash.com/photo-1589519160732-576a3e4f0b11?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "informatics",
    name: "Πληροφορική",
    icon: "MonitorSmartphone",
    color: "bg-slate-500",
    description: "Εξερευνήστε τον κόσμο των υπολογιστών και της πληροφορικής.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "ancient-greek",
    name: "Αρχαία Ελληνική Γλώσσα",
    icon: "BookOpen",
    color: "bg-amber-500",
    description: "Εξερευνήστε την αρχαία ελληνική γλώσσα και τον πολιτισμό.",
    imageUrl: "https://images.unsplash.com/photo-1525924236058-dbe495cd1e3a?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: "robotics",
    name: "Ρομποτική",
    icon: "Bot",
    color: "bg-blue-400",
    description: "Εξερευνήστε τον κόσμο της ρομποτικής και του αυτοματισμού.",
    imageUrl: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=2574&auto=format&fit=crop"
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const sampleQuestions: Record<string, QuizQuestion[]> = {
  "mathematics": [
    {
      id: 1,
      question: "Ποιο είναι το αποτέλεσμα της πράξης 5 + 3;",
      options: ["7", "8", "9", "10"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Ποια είναι η τετραγωνική ρίζα του 25;",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Πόσα είναι 7 επί 8;",
      options: ["54", "55", "56", "57"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Αν x = 10, πόσο είναι 2x + 5;",
      options: ["20", "25", "30", "35"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "Ποιος είναι ο επόμενος αριθμός στην ακολουθία: 2, 4, 6, 8, ...;",
      options: ["9", "10", "11", "12"],
      correctAnswer: 1
    }
  ],
  "physics": [
    {
      id: 1,
      question: "Ποια είναι η μονάδα μέτρησης της δύναμης στο Διεθνές Σύστημα Μονάδων (SI);",
      options: ["Βολτ", "Αμπέρ", "Νιούτον", "Βατ"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Τι μετράει η έννοια της κινητικής ενέργειας;",
      options: ["Την ταχύτητα ενός σώματος", "Την ενέργεια που έχει ένα σώμα λόγω της κίνησής του", "Τη θερμοκρασία ενός σώματος", "Την αντίσταση ενός σώματος στην αλλαγή της κίνησής του"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Ποιος από τους παρακάτω δεν είναι τύπος θερμικής μεταφοράς;",
      options: ["Αγωγή", "Συναγωγή", "Ακτινοβολία", "Διάχυση"],
      correctAnswer: 3
    },
    {
      id: 4,
      question: "Τι είναι η βαρύτητα;",
      options: ["Μια δύναμη που έλκει όλα τα αντικείμενα με μάζα μεταξύ τους", "Μια δύναμη που απωθεί όλα τα αντικείμενα με μάζα μεταξύ τους", "Η αντίσταση του αέρα στην κίνηση", "Η ενέργεια που εκπέμπεται από τον ήλιο"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Ποια είναι η ταχύτητα του φωτός στο κενό;",
      options: ["300.000 χλμ/ώρα", "300.000 χλμ/λεπτό", "300.000 χλμ/δευτερόλεπτο", "300.000 μ/δευτερόλεπτο"],
      correctAnswer: 2
    }
  ],
  "chemistry": [
    {
      id: 1,
      question: "Ποιο είναι το χημικό σύμβολο του νερού;",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Τι είναι η εξάχνωση;",
      options: ["Η μετατροπή ενός αερίου σε υγρό", "Η μετατροπή ενός στερεού απευθείας σε αέριο", "Η μετατροπή ενός υγρού σε στερεό", "Η μετατροπή ενός υγρού σε αέριο"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Ποιο είναι το πιο άφθονο στοιχείο στον φλοιό της Γης;",
      options: ["Σίδηρος", "Οξυγόνο", "Άζωτο", "Αργίλιο"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Τι είναι ένα οξύ;",
      options: ["Μια ουσία με pH μικρότερο του 7", "Μια ουσία με pH μεγαλύτερο του 7", "Μια ουσία με pH ίσο με 7", "Μια ουσία που δεν αντιδρά με άλλες ουσίες"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Ποιος είναι ο χημικός τύπος του αλατιού;",
      options: ["HCl", "NaCl", "H2SO4", "NaOH"],
      correctAnswer: 1
    }
  ],
  "biology": [
    {
      id: 1,
      question: "Τι είναι η φωτοσύνθεση;",
      options: ["Η διαδικασία με την οποία τα φυτά παράγουν ενέργεια από το φως", "Η διαδικασία με την οποία τα ζώα παράγουν ενέργεια από την τροφή", "Η διαδικασία της αναπνοής στα φυτά", "Η διαδικασία της πέψης στα ζώα"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Ποιο είναι το κύριο συστατικό των κυτταρικών μεμβρανών;",
      options: ["Πρωτεΐνες", "Λίπη", "Υδατάνθρακες", "Νουκλεϊκά οξέα"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Τι είναι το DNA;",
      options: ["Το γενετικό υλικό των οργανισμών", "Ένα είδος πρωτεΐνης", "Ένα είδος λίπους", "Ένα είδος υδατάνθρακα"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Ποια είναι η λειτουργία των μιτοχονδρίων;",
      options: ["Παραγωγή ενέργειας", "Αποθήκευση γενετικού υλικού", "Σύνθεση πρωτεϊνών", "Πέψη τροφής"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Τι είναι η μετάλλαξη;",
      options: ["Μια αλλαγή στην αλληλουχία του DNA", "Μια αλλαγή στο περιβάλλον", "Μια αλλαγή στη συμπεριφορά", "Μια αλλαγή στην τροφή"],
      correctAnswer: 0
    }
  ],
  "history": [
    {
      id: 1,
      question: "Πότε ξεκίνησε η Ελληνική Επανάσταση;",
      options: ["1821", "1832", "1829", "1804"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Ποιος ήταν ο πρώτος κυβερνήτης της Ελλάδας μετά την ανεξαρτησία;",
      options: ["Θεόδωρος Κολοκοτρώνης", "Ιωάννης Καποδίστριας", "Αλέξανδρος Υψηλάντης", "Γεώργιος Κουντουριώτης"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Ποια μάχη σήμανε την έναρξη της Ελληνικής Επανάστασης;",
      options: ["Μάχη του Ναυαρίνου", "Μάχη των Θερμοπυλών", "Μάχη της Αλαμάνας", "Μάχη του Μαραθώνα"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Ποιος ήταν ο ηγέτης των Φιλικών;",
      options: ["Αλέξανδρος Υψηλάντης", "Ιωάννης Καποδίστριας", "Θεόδωρος Κολοκοτρώνης", "Γεώργιος Κουντουριώτης"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Ποια συνθήκη αναγνώρισε την ανεξαρτησία της Ελλάδας;",
      options: ["Συνθήκη της Κωνσταντινούπολης", "Συνθήκη του Λονδίνου", "Συνθήκη του Βερολίνου", "Συνθήκη των Παρισίων"],
      correctAnswer: 0
    }
  ],
  "geography": [
    {
      id: 1,
      question: "Ποια είναι η πρωτεύουσα της Ελλάδας;",
      options: ["Θεσσαλονίκη", "Αθήνα", "Πάτρα", "Ηράκλειο"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Ποιο είναι το μεγαλύτερο νησί της Ελλάδας;",
      options: ["Ρόδος", "Κέρκυρα", "Κρήτη", "Εύβοια"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Ποιο είναι το μεγαλύτερο βουνό της Ελλάδας;",
      options: ["Όλυμπος", "Παρνασσός", "Ταΰγετος", "Άθως"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Ποιος είναι ο μεγαλύτερος ποταμός της Ελλάδας;",
      options: ["Αλιάκμονας", "Αχελώος", "Έβρος", "Πηνειός"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Ποια είναι η μεγαλύτερη λίμνη της Ελλάδας;",
      options: ["Βόλβη", "Βεγορίτιδα", "Πρέσπα", "Τριχωνίδα"],
      correctAnswer: 3
    }
  ],
  "robotics": [
    {
      id: 1,
      question: "Τι είναι ο αισθητήρας υπερήχων;",
      options: ["Συσκευή που μετρά αποστάσεις με ηχητικά κύματα", "Συσκευή που μετρά θερμοκρασία", "Συσκευή που ανιχνεύει χρώματα", "Συσκευή που μετρά φωτεινότητα"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Ποια γλώσσα προγραμματισμού χρησιμοποιείται συχνά στη ρομποτική;",
      options: ["Python", "HTML", "CSS", "SQL"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "Τι είναι ο σερβοκινητήρας;",
      options: ["Κινητήρας που μπορεί να ελέγξει με ακρίβεια τη θέση του", "Κινητήρας υψηλής ταχύτητας", "Κινητήρας χαμηλής κατανάλωσης", "Κινητήρας μεγάλης ισχύος"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Τι είναι το Arduino;",
      options: ["Μια πλατφόρμα ανοιχτού κώδικα για ηλεκτρονικά έργα", "Ένα λειτουργικό σύστημα", "Ένα ρομπότ", "Ένα πρόγραμμα σχεδίασης 3D"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Ποιο από τα παρακάτω είναι παράδειγμα αυτόνομου ρομπότ;",
      options: ["Ρομποτική ηλεκτρική σκούπα", "Τηλεκατευθυνόμενο αυτοκίνητο", "Μηχανικό χέρι σε εργοστάσιο", "Ηλεκτρονικό παιχνίδι"],
      correctAnswer: 0
    }
  ],
  "informatics": [
    {
      id: 1,
      question: "Τι είναι η CPU;",
      options: ["Κεντρική Μονάδα Επεξεργασίας", "Κεντρική Μονάδα Προγραμματισμού", "Κύκλωμα Περιφερειακών Υπολογιστών", "Κεντρικό Πρωτόκολλο Υπολογιστών"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Ποιο από τα παρακάτω είναι λειτουργικό σύστημα;",
      options: ["Linux", "Microsoft Word", "Google Chrome", "Adobe Photoshop"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "Τι είναι το URL;",
      options: ["Ενιαίος Εντοπιστής Πόρων (Uniform Resource Locator)", "Παγκόσμια Γλώσσα Αναφοράς", "Μονάδα Μνήμης Υπολογιστή", "Πρωτόκολλο Μεταφοράς Αρχείων"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Πόσα bit αποτελούν ένα byte;",
      options: ["8", "4", "16", "32"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Τι είναι το LAN;",
      options: ["Τοπικό Δίκτυο Υπολογιστών", "Γλώσσα Προγραμματισμού", "Σύστημα Αποθήκευσης", "Λογισμικό Προστασίας από Ιούς"],
      correctAnswer: 0
    }
  ]
};
