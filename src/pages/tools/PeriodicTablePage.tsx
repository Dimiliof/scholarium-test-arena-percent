
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  greekName: string;
  atomicMass: number;
  category: string;
  group: number;
  period: number;
  block: string;
  electronConfiguration: string;
  electronegativity?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  discoveredBy?: string;
  discoveryYear?: number;
}

const PeriodicTablePage = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  
  // Simplified elements data for demonstration
  const elements: Element[] = [
    {
      atomicNumber: 1,
      symbol: 'H',
      name: 'Hydrogen',
      greekName: 'Υδρογόνο',
      atomicMass: 1.008,
      category: 'nonmetal',
      group: 1,
      period: 1,
      block: 's',
      electronConfiguration: '1s¹',
      electronegativity: 2.2,
      density: 0.0000899,
      meltingPoint: -259.16,
      boilingPoint: -252.879,
      discoveredBy: 'Henry Cavendish',
      discoveryYear: 1766
    },
    {
      atomicNumber: 2,
      symbol: 'He',
      name: 'Helium',
      greekName: 'Ήλιο',
      atomicMass: 4.0026,
      category: 'noble-gas',
      group: 18,
      period: 1,
      block: 's',
      electronConfiguration: '1s²',
      density: 0.0001785,
      meltingPoint: -272.2,
      boilingPoint: -268.9,
      discoveredBy: 'Pierre Janssen, Norman Lockyer',
      discoveryYear: 1868
    },
    {
      atomicNumber: 6,
      symbol: 'C',
      name: 'Carbon',
      greekName: 'Άνθρακας',
      atomicMass: 12.011,
      category: 'nonmetal',
      group: 14,
      period: 2,
      block: 'p',
      electronConfiguration: '[He] 2s² 2p²',
      electronegativity: 2.55,
      density: 2.267,
      meltingPoint: 3550,
      boilingPoint: 4027,
      discoveredBy: 'Ancient',
      discoveryYear: 0
    },
    {
      atomicNumber: 8,
      symbol: 'O',
      name: 'Oxygen',
      greekName: 'Οξυγόνο',
      atomicMass: 15.999,
      category: 'nonmetal',
      group: 16,
      period: 2,
      block: 'p',
      electronConfiguration: '[He] 2s² 2p⁴',
      electronegativity: 3.44,
      density: 0.001429,
      meltingPoint: -218.79,
      boilingPoint: -182.962,
      discoveredBy: 'Carl Wilhelm Scheele, Joseph Priestley',
      discoveryYear: 1774
    },
    {
      atomicNumber: 11,
      symbol: 'Na',
      name: 'Sodium',
      greekName: 'Νάτριο',
      atomicMass: 22.99,
      category: 'alkali-metal',
      group: 1,
      period: 3,
      block: 's',
      electronConfiguration: '[Ne] 3s¹',
      electronegativity: 0.93,
      density: 0.968,
      meltingPoint: 97.794,
      boilingPoint: 882.940,
      discoveredBy: 'Humphry Davy',
      discoveryYear: 1807
    },
    {
      atomicNumber: 17,
      symbol: 'Cl',
      name: 'Chlorine',
      greekName: 'Χλώριο',
      atomicMass: 35.45,
      category: 'halogen',
      group: 17,
      period: 3,
      block: 'p',
      electronConfiguration: '[Ne] 3s² 3p⁵',
      electronegativity: 3.16,
      density: 0.003214,
      meltingPoint: -101.5,
      boilingPoint: -34.04,
      discoveredBy: 'Carl Wilhelm Scheele',
      discoveryYear: 1774
    },
    {
      atomicNumber: 26,
      symbol: 'Fe',
      name: 'Iron',
      greekName: 'Σίδηρος',
      atomicMass: 55.845,
      category: 'transition-metal',
      group: 8,
      period: 4,
      block: 'd',
      electronConfiguration: '[Ar] 3d⁶ 4s²',
      electronegativity: 1.83,
      density: 7.874,
      meltingPoint: 1538,
      boilingPoint: 2862,
      discoveredBy: 'Ancient',
      discoveryYear: 0
    },
    {
      atomicNumber: 47,
      symbol: 'Ag',
      name: 'Silver',
      greekName: 'Άργυρος',
      atomicMass: 107.868,
      category: 'transition-metal',
      group: 11,
      period: 5,
      block: 'd',
      electronConfiguration: '[Kr] 4d¹⁰ 5s¹',
      electronegativity: 1.93,
      density: 10.49,
      meltingPoint: 961.93,
      boilingPoint: 2162,
      discoveredBy: 'Ancient',
      discoveryYear: 0
    },
    {
      atomicNumber: 79,
      symbol: 'Au',
      name: 'Gold',
      greekName: 'Χρυσός',
      atomicMass: 196.967,
      category: 'transition-metal',
      group: 11,
      period: 6,
      block: 'd',
      electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
      electronegativity: 2.54,
      density: 19.3,
      meltingPoint: 1064.18,
      boilingPoint: 2856,
      discoveredBy: 'Ancient',
      discoveryYear: 0
    },
    {
      atomicNumber: 92,
      symbol: 'U',
      name: 'Uranium',
      greekName: 'Ουράνιο',
      atomicMass: 238.029,
      category: 'actinide',
      group: 3,
      period: 7,
      block: 'f',
      electronConfiguration: '[Rn] 5f³ 6d¹ 7s²',
      electronegativity: 1.38,
      density: 19.05,
      meltingPoint: 1132.2,
      boilingPoint: 4131,
      discoveredBy: 'Martin Heinrich Klaproth',
      discoveryYear: 1789
    }
  ];
  
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'alkali-metal': 'bg-red-200',
      'alkaline-earth-metal': 'bg-orange-200',
      'transition-metal': 'bg-yellow-200',
      'post-transition-metal': 'bg-lime-200',
      'metalloid': 'bg-green-200',
      'nonmetal': 'bg-emerald-200',
      'halogen': 'bg-cyan-200',
      'noble-gas': 'bg-blue-200',
      'lanthanide': 'bg-indigo-200',
      'actinide': 'bg-violet-200'
    };
    
    return colors[category] || 'bg-gray-200';
  };
  
  const filteredElements = elements.filter(element => 
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.greekName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.atomicNumber.toString().includes(searchTerm)
  );
  
  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };
  
  // Creates a placeholder for table layout
  const renderPeriodicTable = () => {
    // This is a simplified version - a full implementation would place all elements in their correct positions
    
    // Create a grid for 7 periods and 18 groups
    const table = Array(7).fill(null).map(() => Array(18).fill(null));
    
    // Place elements in their correct positions
    elements.forEach(element => {
      if (element.period <= 7 && element.group <= 18) {
        table[element.period - 1][element.group - 1] = element;
      }
    });
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-18 gap-1">
            {/* Column headers (groups) */}
            <div className="col-span-1"></div>
            {Array(18).fill(null).map((_, index) => (
              <div key={`group-${index + 1}`} className="text-center text-xs font-semibold">
                {index + 1}
              </div>
            ))}
            
            {/* Table rows (periods) */}
            {table.map((row, periodIndex) => (
              <React.Fragment key={`period-${periodIndex + 1}`}>
                {/* Period number */}
                <div className="text-center font-semibold flex items-center justify-center">
                  {periodIndex + 1}
                </div>
                
                {/* Elements in this period */}
                {row.map((element, groupIndex) => (
                  <div 
                    key={`p${periodIndex + 1}-g${groupIndex + 1}`}
                    className={`w-12 h-12 flex flex-col justify-center items-center text-center p-1 ${
                      element ? getCategoryColor(element.category) : 'opacity-0'
                    } cursor-pointer hover:shadow-md transition-shadow rounded`}
                    onClick={() => element && handleElementClick(element)}
                  >
                    {element && (
                      <>
                        <div className="text-xs font-semibold">{element.atomicNumber}</div>
                        <div className="text-sm font-bold">{element.symbol}</div>
                      </>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Περιοδικός Πίνακας Στοιχείων</h1>
          
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Αναζήτηση στοιχείου..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="table" value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'list')}>
            <TabsList className="justify-center mb-6">
              <TabsTrigger value="table">Πίνακας</TabsTrigger>
              <TabsTrigger value="list">Λίστα</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="mb-8">
              {renderPeriodicTable()}
            </TabsContent>
            
            <TabsContent value="list">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {filteredElements.map(element => (
                  <Card 
                    key={element.atomicNumber}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${getCategoryColor(element.category)}`}
                    onClick={() => handleElementClick(element)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="text-3xl font-bold">{element.symbol}</div>
                        <div className="text-right">
                          <div className="font-semibold">{element.atomicNumber}</div>
                          <div className="text-sm">{element.atomicMass.toFixed(3)}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="font-medium">{element.greekName}</div>
                        <div className="text-sm text-gray-600">{element.name}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredElements.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">Δεν βρέθηκαν χημικά στοιχεία που να ταιριάζουν με την αναζήτηση.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {selectedElement && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl">{selectedElement.symbol}</span>
                    <span className="ml-2 text-xl">{selectedElement.greekName}</span>
                  </div>
                  <div className="text-right">
                    <div>{selectedElement.atomicNumber}</div>
                    <div className="text-sm">Ατομικός αριθμός</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Βασικές πληροφορίες</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <Label>Όνομα (GR):</Label>
                        <div>{selectedElement.greekName}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Όνομα (EN):</Label>
                        <div>{selectedElement.name}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Σύμβολο:</Label>
                        <div>{selectedElement.symbol}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Ατομικός αριθμός:</Label>
                        <div>{selectedElement.atomicNumber}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Ατομική μάζα:</Label>
                        <div>{selectedElement.atomicMass} u</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Κατηγορία:</Label>
                        <div>{selectedElement.category}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Ομάδα:</Label>
                        <div>{selectedElement.group}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Περίοδος:</Label>
                        <div>{selectedElement.period}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Τομέας:</Label>
                        <div>{selectedElement.block}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Φυσικές ιδιότητες</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <Label>Ηλεκτρονιακή δομή:</Label>
                        <div>{selectedElement.electronConfiguration}</div>
                      </div>
                      {selectedElement.electronegativity && (
                        <div className="grid grid-cols-2">
                          <Label>Ηλεκτραρνητικότητα:</Label>
                          <div>{selectedElement.electronegativity}</div>
                        </div>
                      )}
                      {selectedElement.density && (
                        <div className="grid grid-cols-2">
                          <Label>Πυκνότητα:</Label>
                          <div>{selectedElement.density} g/cm³</div>
                        </div>
                      )}
                      {selectedElement.meltingPoint && (
                        <div className="grid grid-cols-2">
                          <Label>Σημείο τήξης:</Label>
                          <div>{selectedElement.meltingPoint} °C</div>
                        </div>
                      )}
                      {selectedElement.boilingPoint && (
                        <div className="grid grid-cols-2">
                          <Label>Σημείο βρασμού:</Label>
                          <div>{selectedElement.boilingPoint} °C</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2">
                        <Label>Ανακαλύφθηκε από:</Label>
                        <div>{selectedElement.discoveredBy || 'Άγνωστο'}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <Label>Έτος ανακάλυψης:</Label>
                        <div>{selectedElement.discoveryYear === 0 ? 'Αρχαιότητα' : selectedElement.discoveryYear}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Σχετικά με τον Περιοδικό Πίνακα</h2>
            <p className="mb-4">
              Ο περιοδικός πίνακας των χημικών στοιχείων είναι μια διάταξη των χημικών στοιχείων, 
              διατεταγμένων με βάση τον ατομικό τους αριθμό, την ηλεκτρονιακή τους διαμόρφωση 
              και τις επαναλαμβανόμενες χημικές τους ιδιότητες.
            </p>
            <p className="mb-4">
              Η δομή του πίνακα δείχνει περιοδικές τάσεις, συμπεριλαμβανομένων στοιχείων με παρόμοιες
              συμπεριφορές στην ίδια στήλη. Γενικά, εντός μιας σειράς (περιόδου) τα στοιχεία έχουν 
              αυξανόμενο ατομικό αριθμό και από αριστερά προς τα δεξιά αυξανόμενο αριθμό ηλεκτρονίων.
            </p>
            <p>
              Ο σύγχρονος πίνακας, σε γενικές γραμμές, βασίζεται στην κατανόηση της σχέσης μεταξύ της 
              ατομικής δομής και των χημικών ιδιοτήτων, και εξελίχθηκε μέσω της σειράς ανακαλύψεων 
              που ξεκινούν με την παρατήρηση του Dmitri Mendeleev το 1869.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PeriodicTablePage;
