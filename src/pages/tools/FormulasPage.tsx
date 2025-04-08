
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type FormulaCategory = 'mathematics' | 'physics' | 'chemistry' | 'geometry';

interface Formula {
  id: string;
  name: string;
  latex: string;
  formula: string;
  description: string;
  variables: Array<{
    symbol: string;
    name: string;
  }>;
  category: FormulaCategory;
  subcategory: string;
}

const FormulasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<FormulaCategory>('mathematics');
  const { toast } = useToast();
  
  // Sample formulas data
  const formulas: Formula[] = [
    {
      id: 'math-1',
      name: 'Πυθαγόρειο θεώρημα',
      latex: 'c^2 = a^2 + b^2',
      formula: 'c² = a² + b²',
      description: 'Το τετράγωνο της υποτείνουσας ενός ορθογώνιου τριγώνου ισούται με το άθροισμα των τετραγώνων των δύο κάθετων πλευρών.',
      variables: [
        { symbol: 'c', name: 'υποτείνουσα' },
        { symbol: 'a', name: 'κάθετη πλευρά' },
        { symbol: 'b', name: 'κάθετη πλευρά' }
      ],
      category: 'mathematics',
      subcategory: 'Γεωμετρία'
    },
    {
      id: 'math-2',
      name: 'Τετραγωνική εξίσωση',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
      description: 'Η λύση για την εξίσωση ax² + bx + c = 0, όπου a ≠ 0.',
      variables: [
        { symbol: 'x', name: 'άγνωστη μεταβλητή' },
        { symbol: 'a', name: 'συντελεστής του x²' },
        { symbol: 'b', name: 'συντελεστής του x' },
        { symbol: 'c', name: 'σταθερός όρος' }
      ],
      category: 'mathematics',
      subcategory: 'Άλγεβρα'
    },
    {
      id: 'math-3',
      name: 'Παράγωγος συνάρτησης',
      latex: '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
      formula: 'd/dx[f(x)] = lim(h→0) [f(x+h) - f(x)] / h',
      description: 'Ο ορισμός της παραγώγου μιας συνάρτησης f(x) ως όριο.',
      variables: [
        { symbol: 'f(x)', name: 'συνάρτηση του x' },
        { symbol: 'd/dx', name: 'τελεστής παραγώγισης' },
        { symbol: 'h', name: 'μεταβολή του x' }
      ],
      category: 'mathematics',
      subcategory: 'Ανάλυση'
    },
    {
      id: 'physics-1',
      name: 'Δεύτερος νόμος του Newton',
      latex: 'F = ma',
      formula: 'F = m·a',
      description: 'Η συνισταμένη δύναμη που ασκείται σε ένα σώμα ισούται με το γινόμενο της μάζας του επί την επιτάχυνση που αποκτά.',
      variables: [
        { symbol: 'F', name: 'δύναμη (N)' },
        { symbol: 'm', name: 'μάζα (kg)' },
        { symbol: 'a', name: 'επιτάχυνση (m/s²)' }
      ],
      category: 'physics',
      subcategory: 'Μηχανική'
    },
    {
      id: 'physics-2',
      name: 'Νόμος της παγκόσμιας έλξης',
      latex: 'F = G \\frac{m_1 m_2}{r^2}',
      formula: 'F = G · (m₁·m₂) / r²',
      description: 'Η βαρυτική έλξη μεταξύ δύο σωμάτων είναι ανάλογη του γινομένου των μαζών τους και αντιστρόφως ανάλογη του τετραγώνου της απόστασής τους.',
      variables: [
        { symbol: 'F', name: 'δύναμη (N)' },
        { symbol: 'G', name: 'σταθερά βαρύτητας (6.67×10⁻¹¹ N·m²/kg²)' },
        { symbol: 'm₁', name: 'μάζα πρώτου σώματος (kg)' },
        { symbol: 'm₂', name: 'μάζα δεύτερου σώματος (kg)' },
        { symbol: 'r', name: 'απόσταση μεταξύ των σωμάτων (m)' }
      ],
      category: 'physics',
      subcategory: 'Βαρύτητα'
    },
    {
      id: 'physics-3',
      name: 'Ειδική θεωρία της σχετικότητας',
      latex: 'E = mc^2',
      formula: 'E = m·c²',
      description: 'Η ενέργεια (E) ισούται με τη μάζα (m) επί το τετράγωνο της ταχύτητας του φωτός (c).',
      variables: [
        { symbol: 'E', name: 'ενέργεια (J)' },
        { symbol: 'm', name: 'μάζα (kg)' },
        { symbol: 'c', name: 'ταχύτητα του φωτός (3×10⁸ m/s)' }
      ],
      category: 'physics',
      subcategory: 'Σχετικότητα'
    },
    {
      id: 'chemistry-1',
      name: 'Νόμος ιδανικών αερίων',
      latex: 'PV = nRT',
      formula: 'P·V = n·R·T',
      description: 'Περιγράφει τη σχέση μεταξύ πίεσης, όγκου, ποσότητας και θερμοκρασίας για ένα ιδανικό αέριο.',
      variables: [
        { symbol: 'P', name: 'πίεση (Pa)' },
        { symbol: 'V', name: 'όγκος (m³)' },
        { symbol: 'n', name: 'ποσότητα ουσίας (mol)' },
        { symbol: 'R', name: 'σταθερά αερίων (8.314 J/(mol·K))' },
        { symbol: 'T', name: 'θερμοκρασία (K)' }
      ],
      category: 'chemistry',
      subcategory: 'Θερμοδυναμική'
    },
    {
      id: 'chemistry-2',
      name: 'Νόμος του Avogadro',
      latex: 'n = \\frac{N}{N_A}',
      formula: 'n = N / NA',
      description: 'Η ποσότητα ουσίας (n) σε moles ισούται με τον αριθμό των σωματιδίων (N) διαιρεμένο με τον αριθμό Avogadro (NA).',
      variables: [
        { symbol: 'n', name: 'ποσότητα ουσίας (mol)' },
        { symbol: 'N', name: 'αριθμός σωματιδίων' },
        { symbol: 'NA', name: 'αριθμός Avogadro (6.022×10²³ mol⁻¹)' }
      ],
      category: 'chemistry',
      subcategory: 'Στοιχειομετρία'
    },
    {
      id: 'geometry-1',
      name: 'Εμβαδόν κύκλου',
      latex: 'A = \\pi r^2',
      formula: 'A = π·r²',
      description: 'Το εμβαδόν ενός κύκλου ισούται με π επί το τετράγωνο της ακτίνας του.',
      variables: [
        { symbol: 'A', name: 'εμβαδόν' },
        { symbol: 'π', name: 'πι (≈3.14159)' },
        { symbol: 'r', name: 'ακτίνα' }
      ],
      category: 'geometry',
      subcategory: 'Επίπεδη Γεωμετρία'
    },
    {
      id: 'geometry-2',
      name: 'Όγκος σφαίρας',
      latex: 'V = \\frac{4}{3} \\pi r^3',
      formula: 'V = (4/3)·π·r³',
      description: 'Ο όγκος μιας σφαίρας ισούται με τα 4/3 του π επί τον κύβο της ακτίνας της.',
      variables: [
        { symbol: 'V', name: 'όγκος' },
        { symbol: 'π', name: 'πι (≈3.14159)' },
        { symbol: 'r', name: 'ακτίνα' }
      ],
      category: 'geometry',
      subcategory: 'Στερεομετρία'
    }
  ];
  
  const filteredFormulas = formulas.filter(formula => 
    (formula.category === category) && (
      searchTerm === '' || 
      formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Group formulas by subcategory
  const groupedFormulas: Record<string, Formula[]> = {};
  filteredFormulas.forEach(formula => {
    if (!groupedFormulas[formula.subcategory]) {
      groupedFormulas[formula.subcategory] = [];
    }
    groupedFormulas[formula.subcategory].push(formula);
  });
  
  const handleCopyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast({
      title: "Αντιγράφηκε!",
      description: "Ο τύπος αντιγράφηκε στο πρόχειρο.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Συλλογή Μαθηματικών και Φυσικών Τύπων</h1>
          
          <div className="mb-6">
            <Tabs 
              defaultValue="mathematics" 
              value={category}
              onValueChange={(value) => setCategory(value as FormulaCategory)}
              className="justify-center"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="mathematics">Μαθηματικά</TabsTrigger>
                <TabsTrigger value="physics">Φυσική</TabsTrigger>
                <TabsTrigger value="chemistry">Χημεία</TabsTrigger>
                <TabsTrigger value="geometry">Γεωμετρία</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Αναζήτηση τύπου..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {Object.keys(groupedFormulas).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Δεν βρέθηκαν τύποι που να ταιριάζουν με την αναζήτησή σας.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedFormulas).map(([subcategory, formulas]) => (
                <div key={subcategory}>
                  <h2 className="text-xl font-bold mb-4">{subcategory}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formulas.map(formula => (
                      <Card key={formula.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-3">
                          <CardTitle className="text-lg">{formula.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-4">
                            <div className="font-mono text-lg">{formula.formula}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyFormula(formula.formula)}
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">{formula.description}</p>
                          
                          <div className="text-sm">
                            <h4 className="font-semibold mb-1">Μεταβλητές:</h4>
                            <ul className="grid grid-cols-2 gap-1">
                              {formula.variables.map(variable => (
                                <li key={variable.symbol} className="flex items-start gap-1">
                                  <span className="font-mono font-semibold">{variable.symbol}:</span>
                                  <span>{variable.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Πώς να χρησιμοποιήσετε αυτούς τους τύπους</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Για αντιγραφή ενός τύπου, πατήστε το εικονίδιο αντιγραφής δίπλα στον τύπο.</li>
              <li>Χρησιμοποιήστε τους τύπους αυτούς για επίλυση προβλημάτων, αντικαθιστώντας τις μεταβλητές με τις αντίστοιχες τιμές.</li>
              <li>Φιλτράρετε τους τύπους ανά κατηγορία χρησιμοποιώντας τις καρτέλες στο πάνω μέρος.</li>
              <li>Αναζητήστε συγκεκριμένους τύπους χρησιμοποιώντας το πεδίο αναζήτησης.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FormulasPage;
