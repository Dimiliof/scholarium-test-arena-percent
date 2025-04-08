
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Search, BookOpen, CalendarDays, MapPin, Award, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const authors = [
  {
    id: 1,
    name: 'Νίκος Καζαντζάκης',
    image: null,
    bio: 'Ο Νίκος Καζαντζάκης (1883-1957) ήταν Έλληνας συγγραφέας, ποιητής, θεατρικός συγγραφέας, μεταφραστής και φιλόσοφος. Έγραψε σημαντικά έργα όπως το «Βίος και Πολιτεία του Αλέξη Ζορμπά» και «Ο Τελευταίος Πειρασμός».',
    birthplace: 'Ηράκλειο, Κρήτη',
    years: '1883-1957',
    notable_works: [
      'Βίος και Πολιτεία του Αλέξη Ζορμπά (1946)',
      'Ο Καπετάν Μιχάλης (1953)',
      'Ο Τελευταίος Πειρασμός (1955)',
      'Αναφορά στον Γκρέκο (1961)'
    ]
  },
  {
    id: 2,
    name: 'Οδυσσέας Ελύτης',
    image: null,
    bio: 'Ο Οδυσσέας Ελύτης (1911-1996) ήταν ένας από τους σημαντικότερους Έλληνες ποιητές του 20ού αιώνα. Βραβεύτηκε με το Νόμπελ Λογοτεχνίας το 1979. Το έργο του χαρακτηρίζεται από έντονο λυρισμό και επιρροές από τον ελληνικό πολιτισμό.',
    birthplace: 'Ηράκλειο, Κρήτη',
    years: '1911-1996',
    notable_works: [
      'Άξιον Εστί (1959)',
      'Ήλιος ο Πρώτος (1943)',
      'Το Μονόγραμμα (1972)',
      'Μαρία Νεφέλη (1978)'
    ]
  },
  {
    id: 3,
    name: 'Κωνσταντίνος Καβάφης',
    image: null,
    bio: 'Ο Κωνσταντίνος Καβάφης (1863-1933) ήταν Έλληνας ποιητής που έζησε το μεγαλύτερο μέρος της ζωής του στην Αλεξάνδρεια της Αιγύπτου. Θεωρείται ένας από τους σημαντικότερους ποιητές της σύγχρονης ελληνικής λογοτεχνίας.',
    birthplace: 'Αλεξάνδρεια, Αίγυπτος',
    years: '1863-1933',
    notable_works: [
      'Ιθάκη (1911)',
      'Η Πόλις (1910)',
      'Περιμένοντας τους Βαρβάρους (1904)',
      'Τα Κεριά (1899)'
    ]
  },
  {
    id: 4, 
    name: 'Γιώργος Σεφέρης',
    image: null,
    bio: 'Ο Γιώργος Σεφέρης (1900-1971) ήταν Έλληνας ποιητής και διπλωμάτης. Κέρδισε το Νόμπελ Λογοτεχνίας το 1963, και ήταν ο πρώτος Έλληνας που τιμήθηκε με αυτό το βραβείο.',
    birthplace: 'Σμύρνη, Μικρά Ασία',
    years: '1900-1971',
    notable_works: [
      'Μυθιστόρημα (1935)',
      'Ημερολόγιο Καταστρώματος (1940)',
      'Κίχλη (1947)',
      'Τρία Κρυφά Ποιήματα (1966)'
    ]
  },
  {
    id: 5,
    name: 'Αλέξανδρος Παπαδιαμάντης',
    image: null,
    bio: 'Ο Αλέξανδρος Παπαδιαμάντης (1851-1911) ήταν Έλληνας συγγραφέας, γνωστός για τα διηγήματά του που αποτυπώνουν την καθημερινή ζωή των απλών ανθρώπων στη Σκιάθο και αλλού. Θεωρείται ένας από τους θεμελιωτές της νεοελληνικής πεζογραφίας.',
    birthplace: 'Σκιάθος',
    years: '1851-1911',
    notable_works: [
      'Η Φόνισσα (1903)',
      'Οι Έμποροι των Εθνών (1882)',
      'Η Γυφτοπούλα (1884)',
      'Χριστουγεννιάτικα Διηγήματα'
    ]
  }
];

const LiteratureAuthorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<typeof authors[0] | null>(null);
  
  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Συγγραφείς Λογοτεχνίας</h1>
        <p className="text-gray-600 mb-8">
          Ανακαλύψτε πληροφορίες για σημαντικούς Έλληνες και παγκόσμιους συγγραφείς και το έργο τους.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Αναζήτηση Συγγραφέων</CardTitle>
                <CardDescription>
                  Βρείτε πληροφορίες για συγγραφείς με βάση το όνομα ή το έργο τους
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Αναζήτηση συγγραφέα..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {filteredAuthors.length > 0 ? (
                      filteredAuthors.map(author => (
                        <div 
                          key={author.id}
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${selectedAuthor?.id === author.id ? 'bg-primary/10 border border-primary/20' : ''}`}
                          onClick={() => setSelectedAuthor(author)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{author.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{author.years}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Δεν βρέθηκαν συγγραφείς με βάση την αναζήτησή σας
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedAuthor ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">{selectedAuthor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{selectedAuthor.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedAuthor.years}
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedAuthor.birthplace}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Βιογραφία</h3>
                    <p className="text-gray-700">{selectedAuthor.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Σημαντικά Έργα
                    </h3>
                    <ul className="grid gap-2">
                      {selectedAuthor.notable_works.map((work, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                          <span>{work}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button>Περισσότερες πληροφορίες</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div>
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-600 mb-2">Επιλέξτε έναν συγγραφέα</h2>
                  <p className="text-gray-500 max-w-md">
                    Επιλέξτε έναν συγγραφέα από τη λίστα για να δείτε λεπτομερείς πληροφορίες 
                    σχετικά με τη ζωή και το έργο του.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Λογοτεχνικές Περίοδοι</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Αρχαία Ελληνική Λογοτεχνία</CardTitle>
                <CardDescription>800 π.Χ. - 200 μ.Χ.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Περιλαμβάνει έργα όπως τα Ομηρικά Έπη, τις τραγωδίες, τις κωμωδίες και τη λυρική ποίηση. Σημαντικοί συγγραφείς: Όμηρος, Αισχύλος, Σοφοκλής, Ευριπίδης, Αριστοφάνης.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Βυζαντινή Λογοτεχνία</CardTitle>
                <CardDescription>330 μ.Χ. - 1453 μ.Χ.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Περιλαμβάνει θρησκευτικά κείμενα, χρονικά, ποίηση και υμνογραφία. Επηρεασμένη από τη χριστιανική παράδοση και την αρχαία ελληνική κληρονομιά.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Κρητική Αναγέννηση</CardTitle>
                <CardDescription>16ος - 17ος αιώνας</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Σημαντική περίοδος της ελληνικής λογοτεχνίας που επηρεάστηκε από την ιταλική Αναγέννηση. Έργα: Ερωτόκριτος, Η Θυσία του Αβραάμ, Ερωφίλη.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Σύγχρονη Ελληνική Λογοτεχνία</CardTitle>
                <CardDescription>20ος αιώνας - σήμερα</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Χαρακτηρίζεται από ποικιλία θεμάτων και τεχνοτροπιών. Περιλαμβάνει σημαντικούς συγγραφείς όπως Καζαντζάκης, Σεφέρης, Ελύτης, Ρίτσος, Καρυωτάκης, Δημουλά.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiteratureAuthorsPage;
