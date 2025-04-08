
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline, TimelineItem, TimelineItemProps } from '@/components/literature/Timeline';
import { BookText, Calendar, Bookmark, BookOpen, User, Landmark, Globe } from 'lucide-react';

// Ορισμός των λογοτεχνικών περιόδων
const literaryPeriods = [
  {
    id: "ancient",
    name: "Αρχαία Ελληνική Λογοτεχνία",
    timespan: "8ος αιώνας π.Χ. - 4ος αιώνας μ.Χ.",
    description: "Η αρχαία ελληνική λογοτεχνία περιλαμβάνει έργα που γράφτηκαν στην αρχαία ελληνική γλώσσα από την εποχή του Ομήρου έως την πτώση της Ρωμαϊκής Αυτοκρατορίας.",
    key_features: [
      "Ανάπτυξη του Έπους, της Λυρικής Ποίησης και του Δράματος",
      "Έμφαση στην αρμονία, την ισορροπία και την ομορφιά",
      "Εξερεύνηση της ανθρώπινης φύσης και του πεπρωμένου",
      "Φιλοσοφικά και ηθικά θέματα"
    ],
    major_authors: [
      "Όμηρος",
      "Ησίοδος",
      "Σαπφώ",
      "Αισχύλος",
      "Σοφοκλής",
      "Ευριπίδης",
      "Αριστοφάνης",
      "Πλάτωνας",
      "Αριστοτέλης"
    ],
    key_works: [
      "Ιλιάδα και Οδύσσεια (Όμηρος)",
      "Θεογονία (Ησίοδος)",
      "Ορέστεια (Αισχύλος)",
      "Οιδίπους Τύραννος (Σοφοκλής)",
      "Μήδεια (Ευριπίδης)",
      "Λυσιστράτη (Αριστοφάνης)",
      "Πολιτεία (Πλάτων)"
    ]
  },
  {
    id: "byzantine",
    name: "Βυζαντινή Λογοτεχνία",
    timespan: "4ος αιώνας μ.Χ. - 1453 μ.Χ.",
    description: "Η βυζαντινή λογοτεχνία αναπτύχθηκε κατά τη διάρκεια της Βυζαντινής Αυτοκρατορίας και περιλαμβάνει θρησκευτικά κείμενα, ιστορικά χρονικά, ποίηση και άλλα είδη.",
    key_features: [
      "Έντονη επιρροή του Χριστιανισμού και της Ορθόδοξης Εκκλησίας",
      "Συνέχιση της ελληνικής παράδοσης με χριστιανικές επιρροές",
      "Ανάπτυξη της υμνογραφίας και της θρησκευτικής ποίησης",
      "Ιστορικά χρονικά και βιογραφίες αγίων"
    ],
    major_authors: [
      "Ρωμανός ο Μελωδός",
      "Ιωάννης Δαμασκηνός",
      "Μιχαήλ Ψελλός",
      "Άννα Κομνηνή",
      "Συμεών ο Νέος Θεολόγος",
      "Κωνσταντίνος Μανασσής",
      "Θεόδωρος Πρόδρομος"
    ],
    key_works: [
      "Ακάθιστος Ύμνος",
      "Αλεξιάδα (Άννα Κομνηνή)",
      "Διγενής Ακρίτας",
      "Χρονογραφία (Μιχαήλ Ψελλός)",
      "Πτωχοπροδρομικά (Θεόδωρος Πρόδρομος)"
    ]
  },
  {
    id: "cretan-renaissance",
    name: "Κρητική Αναγέννηση",
    timespan: "1453 μ.Χ. - 1669 μ.Χ.",
    description: "Η Κρητική Αναγέννηση ήταν μια περίοδος λογοτεχνικής άνθησης στην Κρήτη κατά την περίοδο της Ενετοκρατίας, με σημαντική επιρροή από την ιταλική Αναγέννηση.",
    key_features: [
      "Συνδυασμός βυζαντινών παραδόσεων με δυτικοευρωπαϊκές επιρροές",
      "Χρήση της κρητικής διαλέκτου",
      "Ανάπτυξη του θεάτρου και της ποίησης",
      "Κοσμικά θέματα με ρομαντικό χαρακτήρα"
    ],
    major_authors: [
      "Βιτσέντζος Κορνάρος",
      "Γεώργιος Χορτάτσης",
      "Μαρίνος Φαλιέρος",
      "Μάρκος Αντώνιος Φώσκολος",
      "Γεώργιος Μόρμορης"
    ],
    key_works: [
      "Ερωτόκριτος (Βιτσέντζος Κορνάρος)",
      "Η Θυσία του Αβραάμ (αποδίδεται στον Βιτσέντζο Κορνάρο)",
      "Ερωφίλη (Γεώργιος Χορτάτσης)",
      "Κατζούρμπος (Γεώργιος Χορτάτσης)",
      "Φορτουνάτος (Μάρκος Αντώνιος Φώσκολος)"
    ]
  },
  {
    id: "enlightenment",
    name: "Νεοελληνικός Διαφωτισμός",
    timespan: "1700 μ.Χ. - 1821 μ.Χ.",
    description: "Ο Νεοελληνικός Διαφωτισμός ήταν μια πνευματική κίνηση που επηρεάστηκε από τον Ευρωπαϊκό Διαφωτισμό και συνέβαλε στην εθνική αφύπνιση των Ελλήνων πριν την Επανάσταση του 1821.",
    key_features: [
      "Έμφαση στην εκπαίδευση και τη διάδοση της γνώσης",
      "Προώθηση των ιδεών της ελευθερίας και της δημοκρατίας",
      "Διερεύνηση της ελληνικής ταυτότητας και κληρονομιάς",
      "Συζήτηση για τη γλώσσα (καθαρεύουσα vs. δημοτική)"
    ],
    major_authors: [
      "Αδαμάντιος Κοραής",
      "Ρήγας Φεραίος",
      "Ιώσηπος Μοισιόδαξ",
      "Δημήτριος Καταρτζής",
      "Ευγένιος Βούλγαρης",
      "Αθανάσιος Ψαλίδας"
    ],
    key_works: [
      "Θούριος (Ρήγας Φεραίος)",
      "Νέα Γεωγραφία (Δανιήλ Φιλιππίδης & Γρηγόριος Κωνσταντάς)",
      "Ελληνική Νομαρχία (Ανώνυμος)",
      "Αδολεσχία Φιλόθεος (Νικηφόρος Θεοτόκης)"
    ]
  },
  {
    id: "19th-century",
    name: "Ελληνική Λογοτεχνία του 19ου αιώνα",
    timespan: "1821 μ.Χ. - 1880 μ.Χ.",
    description: "Η περίοδος αυτή χαρακτηρίζεται από την ανάπτυξη της νεοελληνικής λογοτεχνίας μετά την Ελληνική Επανάσταση, με επιρροές από τον ρομαντισμό και αργότερα τον ρεαλισμό.",
    key_features: [
      "Ρομαντικά ιδεώδη και εθνικός χαρακτήρας στην αρχή της περιόδου",
      "Ανάπτυξη της πεζογραφίας και της ηθογραφίας προς το τέλος",
      "Συζήτηση για την εθνική ταυτότητα στο νεοσύστατο ελληνικό κράτος",
      "Το γλωσσικό ζήτημα παραμένει κεντρικό"
    ],
    major_authors: [
      "Διονύσιος Σολωμός",
      "Ανδρέας Κάλβος",
      "Αλέξανδρος Ρίζος Ραγκαβής",
      "Εμμανουήλ Ροΐδης",
      "Αριστοτέλης Βαλαωρίτης",
      "Δημήτριος Βικέλας"
    ],
    key_works: [
      "Ύμνος εις την Ελευθερίαν (Διονύσιος Σολωμός)",
      "Ωδαί (Ανδρέας Κάλβος)",
      "Η Πάπισσα Ιωάννα (Εμμανουήλ Ροΐδης)",
      "Λουκής Λάρας (Δημήτριος Βικέλας)"
    ]
  },
  {
    id: "ethography",
    name: "Ηθογραφία",
    timespan: "1880 μ.Χ. - 1920 μ.Χ.",
    description: "Η ηθογραφία ήταν ένα λογοτεχνικό ρεύμα που εστίαζε στην περιγραφή των ηθών και των εθίμων της ελληνικής υπαίθρου, με ρεαλιστικό τρόπο.",
    key_features: [
      "Ρεαλιστική απεικόνιση της ζωής στην ελληνική ύπαιθρο",
      "Έμφαση στην τοπική διάλεκτο και το τοπικό χρώμα",
      "Αναπαράσταση παραδόσεων, εθίμων και κοινωνικών συνθηκών",
      "Απλή και άμεση αφηγηματική τεχνική"
    ],
    major_authors: [
      "Γεώργιος Βιζυηνός",
      "Αλέξανδρος Παπαδιαμάντης",
      "Ανδρέας Καρκαβίτσας",
      "Αργύρης Εφταλιώτης",
      "Αλέξανδρος Μωραϊτίδης",
      "Γρηγόριος Ξενόπουλος (πρώιμα έργα)"
    ],
    key_works: [
      "Το Αμάρτημα της Μητρός μου (Γεώργιος Βιζυηνός)",
      "Η Φόνισσα (Αλέξανδρος Παπαδιαμάντης)",
      "Ο Ζητιάνος (Ανδρέας Καρκαβίτσας)",
      "Λυγερή (Αργύρης Εφταλιώτης)"
    ]
  },
  {
    id: "generation-30",
    name: "Γενιά του '30",
    timespan: "1930 μ.Χ. - 1950 μ.Χ.",
    description: "Η Γενιά του '30 ήταν μια ομάδα Ελλήνων διανοούμενων και καλλιτεχνών που εισήγαγαν τον μοντερνισμό στην ελληνική λογοτεχνία και τις τέχνες, συνδυάζοντας τον με την ελληνική παράδοση.",
    key_features: [
      "Μοντερνιστικές τάσεις και τεχνικές",
      "Εξερεύνηση της ελληνικότητας και της σχέσης με την παράδοση",
      "Λυρισμός και συμβολισμός",
      "Επιρροές από την ευρωπαϊκή λογοτεχνία"
    ],
    major_authors: [
      "Γιώργος Σεφέρης",
      "Οδυσσέας Ελύτης",
      "Γιάννης Ρίτσος",
      "Γιώργος Θεοτοκάς",
      "Κοσμάς Πολίτης",
      "Στρατής Μυριβήλης",
      "Άγγελος Τερζάκης",
      "Μ. Καραγάτσης"
    ],
    key_works: [
      "Μυθιστόρημα (Γιώργος Σεφέρης)",
      "Το Άξιον Εστί (Οδυσσέας Ελύτης)",
      "Επιτάφιος (Γιάννης Ρίτσος)",
      "Αργώ (Γιώργος Θεοτοκάς)",
      "Η Ζωή εν Τάφω (Στρατής Μυριβήλης)"
    ]
  },
  {
    id: "postwar",
    name: "Μεταπολεμική Λογοτεχνία",
    timespan: "1950 μ.Χ. - 1980 μ.Χ.",
    description: "Η μεταπολεμική ελληνική λογοτεχνία επηρεάστηκε βαθιά από τις εμπειρίες του Β' Παγκοσμίου Πολέμου, του Εμφυλίου και της μετέπειτα πολιτικής αστάθειας στην Ελλάδα.",
    key_features: [
      "Πολιτικοποιημένη λογοτεχνία",
      "Εξερεύνηση των κοινωνικών και ψυχολογικών τραυμάτων του πολέμου",
      "Υπαρξιακοί προβληματισμοί",
      "Πειραματισμός με νέες αφηγηματικές τεχνικές"
    ],
    major_authors: [
      "Στρατής Τσίρκας",
      "Δημήτρης Χατζής",
      "Αλέξανδρος Κοτζιάς",
      "Κώστας Ταχτσής",
      "Αντώνης Σαμαράκης",
      "Διδώ Σωτηρίου",
      "Μάριος Χάκκας",
      "Τάκης Σινόπουλος"
    ],
    key_works: [
      "Ακυβέρνητες Πολιτείες (Στρατής Τσίρκας)",
      "Το Τέλος της Μικρής μας Πόλης (Δημήτρης Χατζής)",
      "Το Τρίτο Στεφάνι (Κώστας Ταχτσής)",
      "Ματωμένα Χώματα (Διδώ Σωτηρίου)",
      "Το Λάθος (Αντώνης Σαμαράκης)"
    ]
  },
  {
    id: "contemporary",
    name: "Σύγχρονη Ελληνική Λογοτεχνία",
    timespan: "1980 μ.Χ. - σήμερα",
    description: "Η σύγχρονη ελληνική λογοτεχνία χαρακτηρίζεται από ποικιλομορφία, πειραματισμό και πολυφωνία, αντανακλώντας τις κοινωνικές, οικονομικές και πολιτισμικές αλλαγές στη σύγχρονη Ελλάδα.",
    key_features: [
      "Ποικιλία θεμάτων και τεχνικών",
      "Διερεύνηση σύγχρονων κοινωνικών ζητημάτων",
      "Αστικά περιβάλλοντα και χαρακτήρες",
      "Διάλογος με την παγκοσμιοποίηση"
    ],
    major_authors: [
      "Ρέα Γαλανάκη",
      "Θανάσης Βαλτινός",
      "Πέτρος Μάρκαρης",
      "Βασίλης Βασιλικός",
      "Παύλος Μάτεσις",
      "Ισίδωρος Ζουργός",
      "Κική Δημουλά",
      "Αλέξης Σταμάτης"
    ],
    key_works: [
      "Η Άκρα Ταπείνωση (Ρέα Γαλανάκη)",
      "Στοιχεία για τη Δεκαετία του '60 (Θανάσης Βαλτινός)",
      "Νυχτερινό Δελτίο (Πέτρος Μάρκαρης)",
      "Η Αμοιβαδόβιος Σχέση (Βασίλης Βασιλικός)",
      "Η Μητέρα του Σκύλου (Παύλος Μάτεσις)"
    ]
  }
];

// Ορισμός των σημαντικών γεγονότων στο χρονολόγιο
const literaryTimelineEvents: TimelineItemProps[] = [
  {
    year: "8ος αιώνας π.Χ.",
    title: "Ομηρικά Έπη",
    description: "Η Ιλιάδα και η Οδύσσεια, τα πρώτα έργα της δυτικής λογοτεχνίας που έχουν διασωθεί"
  },
  {
    year: "5ος αιώνας π.Χ.",
    title: "Χρυσός Αιώνας του Περικλή",
    description: "Άνθηση του αρχαίου δράματος με τους τραγικούς ποιητές Αισχύλο, Σοφοκλή και Ευριπίδη"
  },
  {
    year: "4ος αιώνας π.Χ.",
    title: "Αριστοτέλης & Πλάτων",
    description: "Φιλοσοφικά έργα που επηρέασαν βαθιά τη λογοτεχνική θεωρία και κριτική"
  },
  {
    year: "4ος-6ος αιώνας μ.Χ.",
    title: "Πρώιμη Βυζαντινή Λογοτεχνία",
    description: "Ανάπτυξη της χριστιανικής λογοτεχνίας και υμνογραφίας"
  },
  {
    year: "1100-1453",
    title: "Ύστερη Βυζαντινή Περίοδος",
    description: "Δημώδη αφηγηματικά ποιήματα όπως ο Διγενής Ακρίτας"
  },
  {
    year: "16ος-17ος αιώνας",
    title: "Κρητική Αναγέννηση",
    description: "Λογοτεχνική άνθηση με έργα όπως ο Ερωτόκριτος του Βιτσέντζου Κορνάρου"
  },
  {
    year: "1750-1821",
    title: "Νεοελληνικός Διαφωτισμός",
    description: "Διάδοση των ιδεών του Διαφωτισμού και προετοιμασία για την Επανάσταση"
  },
  {
    year: "1821-1880",
    title: "Επτανησιακή Σχολή",
    description: "Ανάπτυξη της ποίησης με κύριο εκπρόσωπο τον Διονύσιο Σολωμό"
  },
  {
    year: "1880-1920",
    title: "Περίοδος Ηθογραφίας",
    description: "Ανάπτυξη της πεζογραφίας με κύριους εκπροσώπους τον Παπαδιαμάντη και τον Βιζυηνό"
  },
  {
    year: "1930-1950",
    title: "Γενιά του '30",
    description: "Μοντερνισμός στην ελληνική λογοτεχνία με εκπροσώπους τον Σεφέρη και τον Ελύτη"
  },
  {
    year: "1950-1980",
    title: "Μεταπολεμική Λογοτεχνία",
    description: "Λογοτεχνία επηρεασμένη από τις εμπειρίες του πολέμου και του εμφυλίου"
  },
  {
    year: "1980-σήμερα",
    title: "Σύγχρονη Ελληνική Λογοτεχνία",
    description: "Πολυφωνία και ποικιλομορφία, νέες φωνές και θεματικές"
  }
];

// Συνιστώσα για τη σελίδα Λογοτεχνικών Περιόδων
const LiteraturePeriodsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(literaryPeriods[0]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Λογοτεχνικές Περίοδοι</h1>
        <p className="text-gray-600 mb-8">
          Εξερευνήστε τις σημαντικότερες περιόδους της ελληνικής λογοτεχνίας, από την αρχαιότητα μέχρι σήμερα.
        </p>
        
        <div className="space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Χρονολόγιο Ελληνικής Λογοτεχνίας
              </CardTitle>
              <CardDescription>
                Ιστορική εξέλιξη της ελληνικής λογοτεχνίας ανά τους αιώνες
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline events={literaryTimelineEvents} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Λογοτεχνικές Περίοδοι</CardTitle>
                  <CardDescription>
                    Επιλέξτε μια περίοδο για περισσότερες πληροφορίες
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {literaryPeriods.map((period) => (
                      <div
                        key={period.id}
                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                          ${selectedPeriod.id === period.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        <BookText className={`h-5 w-5 ${selectedPeriod.id === period.id ? 'text-primary' : 'text-gray-500'}`} />
                        <div>
                          <h3 className="font-medium">{period.name}</h3>
                          <p className="text-sm text-gray-500">{period.timespan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPeriod.name}</CardTitle>
                  <CardDescription>{selectedPeriod.timespan}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-gray-700">{selectedPeriod.description}</p>
                  </div>
                  
                  <Tabs defaultValue="features">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="features">Χαρακτηριστικά</TabsTrigger>
                      <TabsTrigger value="authors">Συγγραφείς</TabsTrigger>
                      <TabsTrigger value="works">Έργα</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="features" className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-primary" />
                        Κύρια Χαρακτηριστικά
                      </h3>
                      <ul className="space-y-2">
                        {selectedPeriod.key_features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="authors" className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Σημαντικοί Συγγραφείς
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedPeriod.major_authors.map((author, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-md border border-gray-100 hover:bg-gray-50">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{author}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="works" className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Σημαντικά Έργα
                      </h3>
                      <ul className="space-y-2">
                        {selectedPeriod.key_works.map((work, index) => (
                          <li key={index} className="flex items-start gap-2 p-2 rounded-md border border-gray-100 hover:bg-gray-50">
                            <BookOpen className="h-4 w-4 text-gray-500 mt-0.5" />
                            <span>{work}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Σύγχρονες Τάσεις στην Ευρωπαϊκή Λογοτεχνία
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    Μοντερνισμός
                  </h3>
                  <p className="text-sm text-gray-600">
                    Λογοτεχνικό κίνημα που αναπτύχθηκε στις αρχές του 20ού αιώνα και χαρακτηρίζεται από καινοτομία και πειραματισμό.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    Μεταμοντερνισμός
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ρεύμα που αμφισβητεί τις παραδοσιακές αξίες και αντιλήψεις, με χαρακτηριστικά την αυτοαναφορικότητα και τη διακειμενικότητα.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    Μαγικός Ρεαλισμός
                  </h3>
                  <p className="text-sm text-gray-600">
                    Τεχνοτροπία που συνδυάζει ρεαλιστικά στοιχεία με μαγικά, φανταστικά ή ονειρικά στοιχεία.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    Μεταποικιακή Λογοτεχνία
                  </h3>
                  <p className="text-sm text-gray-600">
                    Λογοτεχνία που εξερευνά τις συνέπειες της αποικιοκρατίας και αναπτύσσει θέματα ταυτότητας και πολιτισμικής υβριδικότητας.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiteraturePeriodsPage;
