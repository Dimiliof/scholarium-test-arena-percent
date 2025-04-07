
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const subjects: Subject[] = [
  {
    id: "ancient-greek",
    name: "Αρχαία Ελληνική Γλώσσα",
    icon: "📜",
    color: "bg-blue-500",
    description: "Γλώσσα, γραμματική και συντακτικό της αρχαίας ελληνικής"
  },
  {
    id: "ancient-literature",
    name: "Αρχαία Ελληνική Γραμματεία",
    icon: "🏛️",
    color: "bg-blue-700",
    description: "Κείμενα και συγγραφείς της αρχαίας ελληνικής λογοτεχνίας"
  },
  {
    id: "modern-greek",
    name: "Νεοελληνική Γλώσσα",
    icon: "🔤",
    color: "bg-green-500",
    description: "Σύγχρονη ελληνική γλώσσα, έκθεση και έκφραση"
  },
  {
    id: "modern-literature",
    name: "Νεοελληνική Γραμματεία",
    icon: "📚",
    color: "bg-green-700",
    description: "Κείμενα και συγγραφείς της νεοελληνικής λογοτεχνίας"
  },
  {
    id: "history",
    name: "Ιστορία",
    icon: "⏳",
    color: "bg-amber-600",
    description: "Παγκόσμια και ελληνική ιστορία από την αρχαιότητα έως σήμερα"
  },
  {
    id: "religion",
    name: "Θρησκευτικά",
    icon: "✝️",
    color: "bg-purple-600",
    description: "Χριστιανική και άλλες θρησκείες, ηθική και φιλοσοφία"
  },
  {
    id: "civics",
    name: "ΚΠΑ",
    icon: "⚖️",
    color: "bg-red-600",
    description: "Κοινωνική και Πολιτική Αγωγή, δημοκρατία και δικαιώματα"
  },
  {
    id: "mathematics",
    name: "Μαθηματικά",
    icon: "🔢",
    color: "bg-indigo-600",
    description: "Άλγεβρα, γεωμετρία, στατιστική και μαθηματική ανάλυση"
  },
  {
    id: "chemistry",
    name: "Χημεία",
    icon: "🧪",
    color: "bg-pink-600",
    description: "Χημικά στοιχεία, ενώσεις, αντιδράσεις και πειράματα"
  },
  {
    id: "physics",
    name: "Φυσική",
    icon: "⚛️",
    color: "bg-blue-600",
    description: "Μηχανική, ηλεκτρομαγνητισμός, θερμοδυναμική και σύγχρονη φυσική"
  },
  {
    id: "biology",
    name: "Βιολογία",
    icon: "🧬",
    color: "bg-green-600",
    description: "Κύτταρα, οργανισμοί, γενετική και οικοσυστήματα"
  },
  {
    id: "technology",
    name: "Τεχνολογία",
    icon: "💻",
    color: "bg-gray-700",
    description: "Πληροφορική, προγραμματισμός και τεχνολογικές εφαρμογές"
  },
  {
    id: "music",
    name: "Μουσική",
    icon: "🎵",
    color: "bg-yellow-600",
    description: "Θεωρία μουσικής, όργανα και μουσική παιδεία"
  },
  {
    id: "art",
    name: "Εικαστικά",
    icon: "🎨",
    color: "bg-orange-500",
    description: "Ζωγραφική, γλυπτική και ιστορία τέχνης"
  },
  {
    id: "emotional-education",
    name: "Συναισθηματική Αγωγή",
    icon: "❤️",
    color: "bg-red-500",
    description: "Ανάπτυξη συναισθηματικών δεξιοτήτων και αυτογνωσία"
  },
  {
    id: "geography",
    name: "Γεωγραφία",
    icon: "🌍",
    color: "bg-cyan-600",
    description: "Φυσική γεωγραφία, κλίμα και πολιτισμοί του κόσμου"
  },
  {
    id: "robotics",
    name: "Ρομποτική",
    icon: "🤖",
    color: "bg-slate-600",
    description: "Κατασκευή και προγραμματισμός ρομπότ και αυτοματισμών"
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const sampleQuestions: Record<string, QuizQuestion[]> = {
  "ancient-greek": [
    {
      id: 1,
      question: "Ποιος είναι ο σωστός τύπος του ρήματος 'παιδεύω' στον αόριστο α', γ' ενικό;",
      options: ["ἐπαίδευσεν", "παιδεύσει", "ἐπαίδευσε", "παιδεύσῃ"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Η λέξη 'δημοκρατία' προέρχεται από:",
      options: ["δῆμος + κράτος", "δῆμος + κρατέω", "δημόσιος + κράτος", "δημότης + κρατέω"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Ποιο από τα παρακάτω είναι παράδειγμα δοτικής πτώσης;",
      options: ["τῷ ἀνθρώπῳ", "τὸν ἄνθρωπον", "τοῦ ἀνθρώπου", "τὸν ἄνθρωπον"],
      correctAnswer: 0
    }
  ],
  "mathematics": [
    {
      id: 1,
      question: "Λύσε την εξίσωση: 2x + 5 = 11",
      options: ["x = 2", "x = 3", "x = 4", "x = 5"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Ποιο είναι το εμβαδόν ενός κύκλου με ακτίνα 4 cm;",
      options: ["16π cm²", "8π cm²", "4π cm²", "32π cm²"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "Αν sin(x) = 0.5, τότε x =",
      options: ["30°", "45°", "60°", "90°"],
      correctAnswer: 0
    }
  ],
  "history": [
    {
      id: 1,
      question: "Πότε έγινε η Μάχη του Μαραθώνα;",
      options: ["490 π.Χ.", "480 π.Χ.", "431 π.Χ.", "323 π.Χ."],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Ποιος ήταν ο πρώτος βασιλιάς της Ελλάδας μετά την επανάσταση του 1821;",
      options: ["Όθωνας", "Γεώργιος Α'", "Κωνσταντίνος Α'", "Παύλος"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "Πότε έγινε η Άλωση της Κωνσταντινούπολης από τους Οθωμανούς;",
      options: ["1204", "1453", "1821", "1922"],
      correctAnswer: 1
    }
  ]
};

// Για όλα τα υπόλοιπα μαθήματα, δημιουργούμε ένα σετ δείγματος ερωτήσεων
subjects.forEach(subject => {
  if (!sampleQuestions[subject.id]) {
    sampleQuestions[subject.id] = [
      {
        id: 1,
        question: `Ερώτηση δείγματος 1 για ${subject.name}`,
        options: ["Επιλογή Α", "Επιλογή Β", "Επιλογή Γ", "Επιλογή Δ"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: `Ερώτηση δείγματος 2 για ${subject.name}`,
        options: ["Επιλογή Α", "Επιλογή Β", "Επιλογή Γ", "Επιλογή Δ"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: `Ερώτηση δείγματος 3 για ${subject.name}`,
        options: ["Επιλογή Α", "Επιλογή Β", "Επιλογή Γ", "Επιλογή Δ"],
        correctAnswer: 2
      }
    ];
  }
});
