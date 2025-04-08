
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftRight } from 'lucide-react';

type ConversionCategory = 'length' | 'mass' | 'volume' | 'temperature' | 'area' | 'time';

interface UnitConversion {
  name: string;
  value: number;
  symbol: string;
}

const ConverterPage = () => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<string>('');
  
  const conversionUnits: Record<ConversionCategory, UnitConversion[]> = {
    length: [
      { name: 'Χιλιόμετρο', value: 1000, symbol: 'km' },
      { name: 'Μέτρο', value: 1, symbol: 'm' },
      { name: 'Εκατοστό', value: 0.01, symbol: 'cm' },
      { name: 'Χιλιοστό', value: 0.001, symbol: 'mm' },
      { name: 'Μίλι', value: 1609.34, symbol: 'mi' },
      { name: 'Γιάρδα', value: 0.9144, symbol: 'yd' },
      { name: 'Πόδι', value: 0.3048, symbol: 'ft' },
      { name: 'Ίντσα', value: 0.0254, symbol: 'in' },
    ],
    mass: [
      { name: 'Τόνος', value: 1000, symbol: 't' },
      { name: 'Κιλό', value: 1, symbol: 'kg' },
      { name: 'Γραμμάριο', value: 0.001, symbol: 'g' },
      { name: 'Χιλιοστόγραμμο', value: 0.000001, symbol: 'mg' },
      { name: 'Λίβρα', value: 0.453592, symbol: 'lb' },
      { name: 'Ουγγιά', value: 0.0283495, symbol: 'oz' },
    ],
    volume: [
      { name: 'Κυβικό μέτρο', value: 1000, symbol: 'm³' },
      { name: 'Λίτρο', value: 1, symbol: 'L' },
      { name: 'Χιλιοστόλιτρο', value: 0.001, symbol: 'mL' },
      { name: 'Γαλόνι (US)', value: 3.78541, symbol: 'gal' },
      { name: 'Κουόρτ (US)', value: 0.946353, symbol: 'qt' },
      { name: 'Πίντα (US)', value: 0.473176, symbol: 'pt' },
      { name: 'Κυβική ίντσα', value: 0.0163871, symbol: 'in³' },
    ],
    temperature: [
      { name: 'Κελσίου', value: 0, symbol: '°C' },
      { name: 'Φαρενάιτ', value: 0, symbol: '°F' },
      { name: 'Κέλβιν', value: 0, symbol: 'K' },
    ],
    area: [
      { name: 'Τετραγωνικό χιλιόμετρο', value: 1000000, symbol: 'km²' },
      { name: 'Εκτάριο', value: 10000, symbol: 'ha' },
      { name: 'Τετραγωνικό μέτρο', value: 1, symbol: 'm²' },
      { name: 'Τετραγωνικό εκατοστό', value: 0.0001, symbol: 'cm²' },
      { name: 'Τετραγωνικό χιλιοστό', value: 0.000001, symbol: 'mm²' },
      { name: 'Τετραγωνικό μίλι', value: 2589988.11, symbol: 'mi²' },
      { name: 'Στρέμμα', value: 1000, symbol: 'στρ' },
      { name: 'Τετραγωνικό πόδι', value: 0.092903, symbol: 'ft²' },
    ],
    time: [
      { name: 'Έτος', value: 31536000, symbol: 'y' },
      { name: 'Μήνας', value: 2592000, symbol: 'μην' },
      { name: 'Εβδομάδα', value: 604800, symbol: 'εβδ' },
      { name: 'Ημέρα', value: 86400, symbol: 'd' },
      { name: 'Ώρα', value: 3600, symbol: 'h' },
      { name: 'Λεπτό', value: 60, symbol: 'min' },
      { name: 'Δευτερόλεπτο', value: 1, symbol: 's' },
      { name: 'Χιλιοστό του δευτερολέπτου', value: 0.001, symbol: 'ms' },
    ],
  };

  useEffect(() => {
    // Set default units when category changes
    const units = conversionUnits[category];
    if (units.length > 0) {
      setFromUnit(units[0].name);
      setToUnit(units[1].name);
    }
  }, [category]);

  useEffect(() => {
    // Calculate conversion when any of the inputs change
    if (fromUnit && toUnit && inputValue !== '') {
      convert();
    }
  }, [fromUnit, toUnit, inputValue, category]);

  const convert = () => {
    const input = parseFloat(inputValue);
    
    if (isNaN(input)) {
      setOutputValue('');
      return;
    }
    
    const units = conversionUnits[category];
    const fromUnitData = units.find(u => u.name === fromUnit);
    const toUnitData = units.find(u => u.name === toUnit);
    
    if (!fromUnitData || !toUnitData) {
      setOutputValue('');
      return;
    }
    
    // Special case for temperature
    if (category === 'temperature') {
      let result = 0;
      
      // Convert to Celsius first
      let celsius = 0;
      if (fromUnit === 'Κελσίου') {
        celsius = input;
      } else if (fromUnit === 'Φαρενάιτ') {
        celsius = (input - 32) * 5/9;
      } else if (fromUnit === 'Κέλβιν') {
        celsius = input - 273.15;
      }
      
      // Convert from Celsius to target unit
      if (toUnit === 'Κελσίου') {
        result = celsius;
      } else if (toUnit === 'Φαρενάιτ') {
        result = celsius * 9/5 + 32;
      } else if (toUnit === 'Κέλβιν') {
        result = celsius + 273.15;
      }
      
      setOutputValue(result.toFixed(4));
      return;
    }
    
    // For all other unit types, use simple ratio conversion
    const baseValue = input * fromUnitData.value;
    const convertedValue = baseValue / toUnitData.value;
    
    setOutputValue(convertedValue.toFixed(4));
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
  };

  const displayUnitSymbol = (unitName: string): string => {
    const units = conversionUnits[category];
    const unit = units.find(u => u.name === unitName);
    return unit ? unit.symbol : '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Μετατροπέας Μονάδων</h1>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                <Tabs 
                  defaultValue="length" 
                  value={category}
                  onValueChange={(value) => setCategory(value as ConversionCategory)}
                  className="justify-center"
                >
                  <TabsList className="grid grid-cols-3 md:grid-cols-6">
                    <TabsTrigger value="length">Μήκος</TabsTrigger>
                    <TabsTrigger value="mass">Μάζα</TabsTrigger>
                    <TabsTrigger value="volume">Όγκος</TabsTrigger>
                    <TabsTrigger value="temperature">Θερμοκρασία</TabsTrigger>
                    <TabsTrigger value="area">Επιφάνεια</TabsTrigger>
                    <TabsTrigger value="time">Χρόνος</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fromValue" className="block mb-2">Από:</Label>
                  <div className="space-y-2">
                    <Input 
                      id="fromValue"
                      type="number" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)}
                      className="text-right"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Επιλέξτε μονάδα" />
                      </SelectTrigger>
                      <SelectContent>
                        {conversionUnits[category].map((unit) => (
                          <SelectItem key={unit.name} value={unit.name}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start md:mt-7">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={swapUnits}
                    className="rounded-full"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="md:col-start-2 md:row-start-1">
                  <Label htmlFor="toValue" className="block mb-2">Προς:</Label>
                  <div className="space-y-2">
                    <Input 
                      id="toValue"
                      type="text" 
                      value={outputValue} 
                      readOnly 
                      className="text-right bg-gray-50"
                    />
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Επιλέξτε μονάδα" />
                      </SelectTrigger>
                      <SelectContent>
                        {conversionUnits[category].map((unit) => (
                          <SelectItem key={unit.name} value={unit.name}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Τύπος Μετατροπής:</h3>
                <p className="mb-2">
                  {inputValue} {fromUnit && displayUnitSymbol(fromUnit)} = {outputValue} {toUnit && displayUnitSymbol(toUnit)}
                </p>
                
                {category === 'temperature' ? (
                  <p className="text-sm text-gray-600">
                    Η μετατροπή θερμοκρασίας χρησιμοποιεί ειδικούς τύπους αντί για απλή αναλογία.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Συντελεστής μετατροπής: 1 {fromUnit && displayUnitSymbol(fromUnit)} = {
                      fromUnit && toUnit ? 
                      (conversionUnits[category].find(u => u.name === fromUnit)?.value || 1) / 
                      (conversionUnits[category].find(u => u.name === toUnit)?.value || 1) 
                      : ''
                    } {toUnit && displayUnitSymbol(toUnit)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Οδηγίες Χρήσης</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Επιλέξτε την κατηγορία μονάδων από τις καρτέλες στο πάνω μέρος</li>
              <li>Εισάγετε την τιμή που θέλετε να μετατρέψετε στο πεδίο "Από"</li>
              <li>Επιλέξτε τις μονάδες μέτρησης από τα αντίστοιχα πεδία</li>
              <li>Η μετατροπή γίνεται αυτόματα και το αποτέλεσμα εμφανίζεται στο πεδίο "Προς"</li>
              <li>Χρησιμοποιήστε το κουμπί με τα βέλη για να αντιστρέψετε τις μονάδες μετατροπής</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConverterPage;
