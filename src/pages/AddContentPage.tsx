
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Mail, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects } from '@/lib/subjectsData';
import { useAddQuestion } from '@/hooks/useAddQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddQuestionForm } from '@/components/AddQuestionForm';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const AddContentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'initial' | 'verify' | 'verified'>('initial');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { addQuestion, isAdding } = useAddQuestion();
  
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };
  
  const handleBack = () => {
    if (verificationStep === 'verify') {
      setVerificationStep('initial');
    } else {
      setSelectedSubject(null);
    }
  };
  
  const handleQuestionAdded = () => {
    toast({
      title: "Επιτυχής προσθήκη!",
      description: "Η ερώτηση προστέθηκε επιτυχώς στο σύστημα.",
      variant: "default",
    });
  };

  const handleSendVerification = () => {
    if (verificationMethod === 'email' && !emailInput) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε το email σας.",
        variant: "destructive",
      });
      return;
    }

    if (verificationMethod === 'sms' && !phoneInput) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε το κινητό σας τηλέφωνο.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Προσομοίωση αποστολής κωδικού
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('verify');
      toast({
        title: "Κωδικός εστάλη",
        description: verificationMethod === 'email' 
          ? `Ένας κωδικός επαλήθευσης έχει σταλεί στο ${emailInput}` 
          : `Ένας κωδικός επαλήθευσης έχει σταλεί στο ${phoneInput}`,
      });
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (!otpCode || otpCode.length < 6) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε έναν έγκυρο κωδικό επαλήθευσης.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Προσομοίωση επαλήθευσης κωδικού - για δοκιμή θεωρούμε ότι ο κωδικός 123456 είναι σωστός
    setTimeout(() => {
      setIsVerifying(false);
      
      if (otpCode === "123456") {
        setVerificationStep('verified');
        toast({
          title: "Επιτυχής επαλήθευση!",
          description: "Έχετε πλέον πρόσβαση στην προσθήκη εκπαιδευτικού υλικού.",
        });
        
        // Αποθηκεύουμε την επαλήθευση στο localStorage για να μη χρειάζεται να επαληθεύει κάθε φορά
        localStorage.setItem('educatorVerified', 'true');
        localStorage.setItem('educatorEmail', verificationMethod === 'email' ? emailInput : '');
        localStorage.setItem('educatorPhone', verificationMethod === 'sms' ? phoneInput : '');
      } else {
        toast({
          title: "Λάθος κωδικός",
          description: "Ο κωδικός που εισάγατε δεν είναι σωστός. Παρακαλώ δοκιμάστε ξανά.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  // Έλεγχος αν ο χρήστης είναι ήδη επαληθευμένος
  useState(() => {
    const isVerified = localStorage.getItem('educatorVerified') === 'true';
    if (isVerified) {
      setVerificationStep('verified');
      const savedEmail = localStorage.getItem('educatorEmail');
      const savedPhone = localStorage.getItem('educatorPhone');
      if (savedEmail) {
        setEmailInput(savedEmail);
        setVerificationMethod('email');
      } else if (savedPhone) {
        setPhoneInput(savedPhone);
        setVerificationMethod('sms');
      }
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Προσθήκη Υλικού</h1>
        
        {verificationStep === 'initial' && (
          <Card>
            <CardHeader>
              <CardTitle>Επαλήθευση Εκπαιδευτικού</CardTitle>
              <CardDescription>
                Για να προσθέσετε εκπαιδευτικό υλικό, χρειάζεται πρώτα να επαληθεύσετε την ιδιότητά σας ως εκπαιδευτικός.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" onValueChange={(value) => setVerificationMethod(value as 'email' | 'sms')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="email">Επαλήθευση μέσω Email</TabsTrigger>
                  <TabsTrigger value="sms">Επαλήθευση μέσω SMS</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Εκπαιδευτικού</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="me@school.edu.gr" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Παρακαλώ εισάγετε το επίσημο email σας ως εκπαιδευτικός.
                      </p>
                    </div>
                    <Button onClick={handleSendVerification} disabled={isVerifying} className="w-full">
                      {isVerifying ? "Αποστολή..." : "Αποστολή Κωδικού Επαλήθευσης"}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="sms">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Αριθμός Κινητού</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="69XXXXXXXX" 
                        value={phoneInput} 
                        onChange={(e) => setPhoneInput(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Παρακαλώ εισάγετε τον αριθμό του κινητού σας τηλεφώνου.
                      </p>
                    </div>
                    <Button onClick={handleSendVerification} disabled={isVerifying} className="w-full">
                      {isVerifying ? "Αποστολή..." : "Αποστολή Κωδικού Επαλήθευσης"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {verificationStep === 'verify' && (
          <Card>
            <CardHeader>
              <CardTitle>Εισαγωγή Κωδικού Επαλήθευσης</CardTitle>
              <CardDescription>
                Παρακαλώ εισάγετε τον 6-ψήφιο κωδικό που σας στείλαμε
                {verificationMethod === 'email' ? ` στο ${emailInput}` : ` στο ${phoneInput}`}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleVerifyCode} disabled={isVerifying} className="w-full">
                    {isVerifying ? "Επαλήθευση..." : "Επαλήθευση Κωδικού"}
                  </Button>
                  <Button variant="outline" onClick={handleBack} className="w-full">
                    Πίσω
                  </Button>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Δεν λάβατε τον κωδικό; <Button variant="link" className="p-0 h-auto" onClick={handleSendVerification}>Αποστολή ξανά</Button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationStep === 'verified' && !selectedSubject && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-green-700">
                Έχετε επαληθευτεί ως εκπαιδευτικός και μπορείτε να προσθέσετε υλικό.
              </p>
            </div>
            
            <p className="text-lg mb-6">Επιλέξτε το μάθημα στο οποίο θέλετε να προσθέσετε υλικό:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSubjectSelect(subject.id)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`${subject.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl`}>
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{subject.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        
        {verificationStep === 'verified' && selectedSubject && (
          <div>
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mb-6"
            >
              &larr; Πίσω στα μαθήματα
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {subjects.find(s => s.id === selectedSubject)?.name} - Προσθήκη Νέας Ερώτησης
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuestionForm 
                  subjectId={selectedSubject}
                  onSuccess={handleQuestionAdded}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AddContentPage;
