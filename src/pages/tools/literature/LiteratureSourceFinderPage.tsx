
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Book, ChevronRight, Award, Clock } from 'lucide-react';

const LiteratureSourceFinderPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Προσομοίωση αποτελεσμάτων αναζήτησης
    setTimeout(() => {
      const demoResults = [
        {
          title: 'Ερωτόκριτος',
          author: 'Βιτσέντζος Κορνάρος',
          year: '1590-1610',
          type: 'Ποίημα',
          description: 'Ένα από τα σημαντικότερα έργα της κρητικής λογοτεχνίας που γράφτηκε την περίοδο της Κρητικής Αναγέννησης.',
        },
        {
          title: 'Ο Ζητιάνος',
          author: 'Ανδρέας Καρκαβίτσας',
          year: '1896',
          type: 'Νουβέλα',
          description: 'Ένα από τα κυριότερα έργα του Ανδρέα Καρκαβίτσα που αποτυπώνει την ελληνική κοινωνία του 19ου αιώνα.',
        },
        {
          title: 'Ο Καπετάν Μιχάλης',
          author: 'Νίκος Καζαντζάκης',
          year: '1953',
          type: 'Μυθιστόρημα',
          description: 'Έργο του Νίκου Καζαντζάκη που διαδραματίζεται στην Κρήτη κατά την περίοδο του αγώνα για την απελευθέρωση.',
        },
      ];
      
      setSearchResults(demoResults);
      setIsSearching(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Εύρεση Λογοτεχνικών Πηγών</h1>
        <p className="text-gray-600 mb-8">
          Το εργαλείο αυτό σας επιτρέπει να αναζητήσετε λογοτεχνικές πηγές, βιβλία και άρθρα σχετικά με την ελληνική και παγκόσμια λογοτεχνία.
        </p>
        
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="search">Αναζήτηση</TabsTrigger>
            <TabsTrigger value="popular">Δημοφιλείς Πηγές</TabsTrigger>
            <TabsTrigger value="recent">Πρόσφατες Προσθήκες</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Αναζήτηση Λογοτεχνικών Πηγών</CardTitle>
                <CardDescription>
                  Αναζητήστε βιβλία, ποιήματα, μελέτες και άλλες λογοτεχνικές πηγές
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Αναζήτηση τίτλου, συγγραφέα ή άλλων λέξεων-κλειδιών..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Αναζήτηση...' : 'Αναζήτηση'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Αποτελέσματα Αναζήτησης</h2>
                {searchResults.map((result, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-md">
                          <Book className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{result.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1 mb-2">
                            <span className="text-sm font-medium text-gray-600">{result.author}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {result.year}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{result.type}</span>
                          </div>
                          <p className="text-gray-600">{result.description}</p>
                          <div className="mt-4">
                            <Button variant="link" className="p-0 h-auto font-semibold">
                              Περισσότερες πληροφορίες <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Δημοφιλείς Ελληνικές Πηγές</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Ερωτόκριτος - Βιτσέντζος Κορνάρος</h4>
                        <p className="text-sm text-gray-500">Ποίημα, 1590-1610</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Το Αμάρτημα της Μητρός μου - Γεώργιος Βιζυηνός</h4>
                        <p className="text-sm text-gray-500">Διήγημα, 1883</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Ο Ζητιάνος - Ανδρέας Καρκαβίτσας</h4>
                        <p className="text-sm text-gray-500">Νουβέλα, 1896</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Η Φόνισσα - Αλέξανδρος Παπαδιαμάντης</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1903</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Βίος και Πολιτεία του Αλέξη Ζορμπά - Νίκος Καζαντζάκης</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1946</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Δημοφιλείς Παγκόσμιες Πηγές</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Το Έγκλημα και Τιμωρία - Φιοντόρ Ντοστογιέφσκι</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1866</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">1984 - Τζορτζ Όργουελ</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1949</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Ο Αλχημιστής - Πάολο Κοέλο</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1988</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Εκατό Χρόνια Μοναξιά - Γκαμπριέλ Γκαρσία Μάρκες</h4>
                        <p className="text-sm text-gray-500">Μυθιστόρημα, 1967</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Ο Μικρός Πρίγκιπας - Αντουάν ντε Σαιντ-Εξυπερύ</h4>
                        <p className="text-sm text-gray-500">Νουβέλα, 1943</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Πρόσφατες Προσθήκες</CardTitle>
                <CardDescription>
                  Λογοτεχνικές πηγές που προστέθηκαν πρόσφατα στη βάση δεδομένων μας
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  <li className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-md">
                        <Book className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Η Πύλη της Ανατολής - Ιζαμπέλ Αλιέντε</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Ένα συναρπαστικό μυθιστόρημα που διαδραματίζεται στην Καλιφόρνια του 19ου αιώνα.
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>Προστέθηκε: 10/04/2025</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-md">
                        <Book className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Η Αρπαγή της Περσεφόνης - Δημήτρης Λιαντίνης</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Μια σύγχρονη προσέγγιση του αρχαίου μύθου που συνδυάζει φιλοσοφία και λογοτεχνία.
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>Προστέθηκε: 05/04/2025</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-md">
                        <Book className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Το Τέλος της Εποχής των Παγετώνων - Κική Δημουλά</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Συλλογή ποιημάτων που εξερευνά έννοιες όπως ο χρόνος, η μνήμη και η απώλεια.
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span>Προστέθηκε: 01/04/2025</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Δείτε περισσότερες πρόσφατες προσθήκες</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiteratureSourceFinderPage;
