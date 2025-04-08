
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CalculatorPage = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [calculationType, setCalculationType] = useState<'standard' | 'scientific'>('standard');

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = 0;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        case '^':
          newValue = Math.pow(currentValue, inputValue);
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const executeFunction = (funcName: string) => {
    const inputValue = parseFloat(display);
    let result = 0;

    switch (funcName) {
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = Math.pow(inputValue, 2);
        break;
      case 'sin':
        result = Math.sin(inputValue * (Math.PI / 180)); // Convert to radians
        break;
      case 'cos':
        result = Math.cos(inputValue * (Math.PI / 180)); // Convert to radians
        break;
      case 'tan':
        result = Math.tan(inputValue * (Math.PI / 180)); // Convert to radians
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'fac':
        result = factorial(inputValue);
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    performOperation('=');
    setOperator(null);
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(false);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    const percent = value / 100;
    setDisplay(String(percent));
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Επιστημονικός Υπολογιστής</h1>
          
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                <Tabs 
                  defaultValue="standard" 
                  value={calculationType}
                  onValueChange={(value) => setCalculationType(value as 'standard' | 'scientific')}
                  className="justify-center"
                >
                  <TabsList>
                    <TabsTrigger value="standard">Βασικός</TabsTrigger>
                    <TabsTrigger value="scientific">Επιστημονικός</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input 
                  type="text" 
                  value={display} 
                  readOnly 
                  className="text-right text-2xl font-mono p-4 h-16"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                <Button variant="outline" onClick={handleMemoryClear} className="bg-gray-100">MC</Button>
                <Button variant="outline" onClick={handleMemoryRecall} className="bg-gray-100">MR</Button>
                <Button variant="outline" onClick={handleMemoryAdd} className="bg-gray-100">M+</Button>
                <Button variant="outline" onClick={handleMemorySubtract} className="bg-gray-100">M-</Button>
              </div>
              
              {calculationType === 'scientific' && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <Button variant="outline" onClick={() => executeFunction('sin')}>sin</Button>
                  <Button variant="outline" onClick={() => executeFunction('cos')}>cos</Button>
                  <Button variant="outline" onClick={() => executeFunction('tan')}>tan</Button>
                  <Button variant="outline" onClick={() => executeFunction('log')}>log</Button>
                  <Button variant="outline" onClick={() => executeFunction('ln')}>ln</Button>
                  <Button variant="outline" onClick={() => executeFunction('sqrt')}>√</Button>
                  <Button variant="outline" onClick={() => executeFunction('square')}>x²</Button>
                  <Button variant="outline" onClick={() => performOperation('^')}>x^y</Button>
                  <Button variant="outline" onClick={() => executeFunction('fac')}>n!</Button>
                  <Button variant="outline" onClick={() => inputDigit('3.14159')}>π</Button>
                  <Button variant="outline" onClick={() => inputDigit('2.71828')}>e</Button>
                  <Button variant="outline" onClick={() => setDisplay(String(Math.random()))}>rand</Button>
                </div>
              )}
              
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={clearAll} className="bg-red-100 hover:bg-red-200">AC</Button>
                <Button variant="outline" onClick={clearDisplay} className="bg-gray-100">C</Button>
                <Button variant="outline" onClick={handlePercentage} className="bg-gray-100">%</Button>
                <Button variant="outline" onClick={() => performOperation('÷')} className="bg-blue-100 hover:bg-blue-200">÷</Button>
                
                <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
                <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
                <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
                <Button variant="outline" onClick={() => performOperation('×')} className="bg-blue-100 hover:bg-blue-200">×</Button>
                
                <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
                <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
                <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
                <Button variant="outline" onClick={() => performOperation('-')} className="bg-blue-100 hover:bg-blue-200">-</Button>
                
                <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
                <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
                <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
                <Button variant="outline" onClick={() => performOperation('+')} className="bg-blue-100 hover:bg-blue-200">+</Button>
                
                <Button variant="outline" onClick={handleToggleSign}>+/-</Button>
                <Button variant="outline" onClick={() => inputDigit('0')}>0</Button>
                <Button variant="outline" onClick={inputDecimal}>.</Button>
                <Button variant="outline" onClick={handleEquals} className="bg-green-200 hover:bg-green-300">=</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 max-w-xl mx-auto bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Οδηγίες Χρήσης</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Χρησιμοποιήστε τα αριθμητικά πλήκτρα για την εισαγωγή αριθμών</li>
              <li>Οι βασικές πράξεις (+, -, ×, ÷) λειτουργούν όπως σε έναν κανονικό υπολογιστή</li>
              <li>Στον επιστημονικό υπολογιστή έχετε πρόσβαση σε τριγωνομετρικές συναρτήσεις και άλλες προχωρημένες λειτουργίες</li>
              <li>Χρησιμοποιήστε τις επιλογές μνήμης (M+, M-, MR, MC) για αποθήκευση και ανάκληση αριθμών</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CalculatorPage;
