
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface VerificationStepProps {
  verificationMethod: 'email' | 'sms';
  emailInput: string;
  phoneInput: string;
  isVerifying: boolean;
  setVerificationMethod: (method: 'email' | 'sms') => void;
  setEmailInput: (email: string) => void;
  setPhoneInput: (phone: string) => void;
  handleSendVerification: () => void;
  showTestCode: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  verificationMethod,
  emailInput,
  phoneInput,
  isVerifying,
  setVerificationMethod,
  setEmailInput,
  setPhoneInput,
  handleSendVerification,
  showTestCode
}) => {
  return (
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
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                <Button variant="link" className="p-0 h-auto text-xs" onClick={showTestCode}>
                  Εμφάνιση δοκιμαστικού κωδικού (για ανάπτυξη)
                </Button>
              </p>
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
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                <Button variant="link" className="p-0 h-auto text-xs" onClick={showTestCode}>
                  Εμφάνιση δοκιμαστικού κωδικού (για ανάπτυξη)
                </Button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VerificationStep;
