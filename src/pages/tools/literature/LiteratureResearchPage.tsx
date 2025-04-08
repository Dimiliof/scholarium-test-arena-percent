
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, AlignLeft, FileText, Download, Copy, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LiteratureResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Προσομοίωση αποτελεσμάτων έρευνας
    setTimeout(() => {
      const demoResults = [
        "«Σχετικά με την αλληγορία στο έργο του Καζαντζάκη 'Ο Καπετάν Μιχάλης'», Μελέτη, Πανεπιστήμιο Αθηνών, 2022",
        "«Η έννοια της ελευθερίας στον Ζορμπά του Καζαντζάκη», Λογοτεχνική Επιθεώρηση, τ. 45, 2018",
        "«Θρησκευτικά μοτίβα στο έργο του Νίκου Καζαντζάκη», Θεολογική Επιθεώρηση, 2020",
        "«Η Κρήτη ως τόπος και συμβολισμός στο έργο του Καζαντζάκη», Νεοελληνική Λογοτεχνία, 2021",
        "«Οι γυναικείες μορφές στα μυθιστορήματα του Καζαντζάκη», Γυναικείες Σπουδές, τ. 12, 2019"
      ];
      
      setSearchResults(demoResults);
      setIsSearching(false);
    }, 1000);
  };
  
  const handleAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisText.trim()) return;
    
    // Προσομοίωση αποτελέσματος ανάλυσης
    setTimeout(() => {
      setAnalysisResult(`
# Λογοτεχνική Ανάλυση

## Γενικά Χαρακτηριστικά
Το κείμενο που αναλύθηκε αποτελεί παράδειγμα σύγχρονης ελληνικής πεζογραφίας, με έντονα στοιχεία ρεαλισμού και τοπικού χρώματος. Η γλώσσα είναι δημοτική με ορισμένους ιδιωματισμούς.

## Ύφος και Τεχνοτροπία
- Η αφήγηση γίνεται σε τρίτο πρόσωπο με εμβόλιμες περιγραφές τοπίων
- Παρατηρείται χρήση εκτεταμένων μεταφορών και παρομοιώσεων
- Υπάρχει έντονη χρήση διαλόγου που αναδεικνύει τους χαρακτήρες
- Το ύφος συνδυάζει λυρικά στοιχεία με ρεαλιστικές περιγραφές

## Θεματικοί Άξονες
1. Η αντίθεση μεταξύ παράδοσης και νεωτερικότητας
2. Η σχέση του ανθρώπου με τη φύση και τον τόπο του
3. Η αναζήτηση προσωπικής ταυτότητας και ελευθερίας

## Συγγραφικές Επιρροές
Το κείμενο φαίνεται να επηρεάζεται από την παράδοση της ηθογραφίας και του νατουραλισμού, με πιθανές επιρροές από έργα των Παπαδιαμάντη, Καζαντζάκη και της γενιάς του '30.
      `);
    }, 1000);
  };
  
  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Εργαλείο Έρευνας Λογοτεχνίας</h1>
        <p className="text-gray-600 mb-8">
          Ερευνήστε λογοτεχνικά έργα, αναλύστε κείμενα και βρείτε πληροφορίες για ερευνητικές εργασίες.
        </p>
        
        <Tabs defaultValue="research" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="research">Έρευνα</TabsTrigger>
            <TabsTrigger value="analysis">Ανάλυση Κειμένου</TabsTrigger>
            <TabsTrigger value="resources">Πηγές</TabsTrigger>
          </TabsList>
          
          <TabsContent value="research">
            <Card>
              <CardHeader>
                <CardTitle>Έρευνα Λογοτεχνίας</CardTitle>
                <CardDescription>
                  Αναζητήστε ακαδημαϊκές εργασίες και άρθρα σχετικά με λογοτεχνικά έργα και συγγραφείς
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-query">Θέμα Αναζήτησης</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="search-query"
                        placeholder="π.χ. Καζαντζάκης αλληγορία, μοντερνισμός ελληνική ποίηση..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Γλώσσα</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Επιλέξτε γλώσσα" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Όλες</SelectItem>
                          <SelectItem value="greek">Ελληνικά</SelectItem>
                          <SelectItem value="english">Αγγλικά</SelectItem>
                          <SelectItem value="french">Γαλλικά</SelectItem>
                          <SelectItem value="german">Γερμανικά</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resource-type">Τύπος Πηγής</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="resource-type">
                          <SelectValue placeholder="Επιλέξτε τύπο" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Όλα</SelectItem>
                          <SelectItem value="article">Άρθρα</SelectItem>
                          <SelectItem value="thesis">Διατριβές</SelectItem>
                          <SelectItem value="book">Βιβλία</SelectItem>
                          <SelectItem value="conference">Συνέδρια</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                      {isSearching ? 'Αναζήτηση...' : 'Αναζήτηση'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {searchResults.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Αποτελέσματα Έρευνας</CardTitle>
                  <CardDescription>Βρέθηκαν {searchResults.length} αποτελέσματα για "{searchQuery}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 divide-y">
                    {searchResults.map((result, index) => (
                      <li key={index} className="pt-4 first:pt-0">
                        <div className="flex gap-3">
                          <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{result}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <Button variant="outline" size="sm">
                                Προβολή
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Λήψη
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Ανάλυση Λογοτεχνικού Κειμένου</CardTitle>
                <CardDescription>
                  Εισάγετε ένα απόσπασμα κειμένου για ανάλυση των λογοτεχνικών χαρακτηριστικών του
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalysis} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="analysis-text">Κείμενο προς Ανάλυση</Label>
                    <Textarea
                      id="analysis-text"
                      placeholder="Επικολλήστε εδώ το κείμενο προς ανάλυση (τουλάχιστον 100 λέξεις)..."
                      className="min-h-[200px]"
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="analysis-type">Τύπος Ανάλυσης</Label>
                      <Select defaultValue="full">
                        <SelectTrigger id="analysis-type">
                          <SelectValue placeholder="Επιλέξτε τύπο ανάλυσης" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Πλήρης Ανάλυση</SelectItem>
                          <SelectItem value="style">Ύφος και Τεχνοτροπία</SelectItem>
                          <SelectItem value="themes">Θεματικοί Άξονες</SelectItem>
                          <SelectItem value="narrative">Αφηγηματικές Τεχνικές</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="analysis-format">Μορφή Αποτελέσματος</Label>
                      <Select defaultValue="markdown">
                        <SelectTrigger id="analysis-format">
                          <SelectValue placeholder="Επιλέξτε μορφή" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="markdown">Markdown</SelectItem>
                          <SelectItem value="text">Απλό Κείμενο</SelectItem>
                          <SelectItem value="academic">Ακαδημαϊκή Μορφή</SelectItem>
                          <SelectItem value="bullet">Σημεία (Bullet Points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={analysisText.length < 100}>
                      Ανάλυση Κειμένου
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {analysisResult && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Αποτέλεσμα Ανάλυσης</CardTitle>
                    <CardDescription>Λογοτεχνική ανάλυση του κειμένου που υποβάλατε</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                          Αντιγράφηκε
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Αντιγραφή
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Λήψη
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{analysisResult}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Βιβλιογραφικές Πηγές</CardTitle>
                  <CardDescription>
                    Συλλογή βιβλιογραφικών πηγών και βάσεων δεδομένων για έρευνα λογοτεχνίας
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Εθνική Βιβλιοθήκη της Ελλάδος</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Η μεγαλύτερη βιβλιοθήκη της Ελλάδας με ψηφιοποιημένο υλικό και σπάνιες εκδόσεις.
                        </p>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Επίσκεψη</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Ψηφιακή Βιβλιοθήκη Νεοελληνικών Σπουδών</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Συλλογή ψηφιοποιημένων κειμένων της νεοελληνικής λογοτεχνίας και κριτικές αναλύσεις.
                        </p>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Επίσκεψη</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">JSTOR - Ελληνική Λογοτεχνία</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Ακαδημαϊκή βάση δεδομένων με άρθρα, μελέτες και αναλύσεις σχετικά με την ελληνική λογοτεχνία.
                        </p>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Επίσκεψη</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Project Gutenberg - Ελληνική Συλλογή</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Δωρεάν ψηφιακά βιβλία ελληνικής και μεταφρασμένης λογοτεχνίας σε διάφορες μορφές.
                        </p>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Επίσκεψη</a>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Εργαλεία για Φιλολόγους και Ερευνητές</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium mb-2">Εργαλείο Βιβλιογραφικών Αναφορών</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Δημιουργήστε αυτόματα βιβλιογραφικές αναφορές σε διάφορα στυλ (APA, MLA, Chicago).
                      </p>
                      <Button variant="outline" size="sm">Χρήση Εργαλείου</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium mb-2">Ανάλυση Μετρικής Ποίησης</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Αναλύστε τη μετρική και τον ρυθμό ποιητικών κειμένων αυτόματα.
                      </p>
                      <Button variant="outline" size="sm">Χρήση Εργαλείου</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium mb-2">Συγκριτική Ανάλυση Κειμένων</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Συγκρίνετε δύο ή περισσότερα κείμενα για ομοιότητες και διαφορές στο ύφος και το λεξιλόγιο.
                      </p>
                      <Button variant="outline" size="sm">Χρήση Εργαλείου</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium mb-2">Λεξικό Λογοτεχνικών Όρων</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Ολοκληρωμένο λεξικό λογοτεχνικών εννοιών, ρευμάτων και τεχνικών.
                      </p>
                      <Button variant="outline" size="sm">Χρήση Εργαλείου</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiteratureResearchPage;
