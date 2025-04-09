
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface VerifyCodeStepProps {
  verificationMethod: 'email' | 'sms';
  emailInput: string;
  phoneInput: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isVerifying: boolean;
  handleVerifyCode: () => void;
  handleBack: () => void;
  handleSendVerification: () => void;
  showTestCode: () => void;
}

const VerifyCodeStep: React.FC<VerifyCodeStepProps> = ({
  verificationMethod,
  emailInput,
  phoneInput,
  otpCode,
  setOtpCode,
  isVerifying,
  handleVerifyCode,
  handleBack,
  handleSendVerification,
  showTestCode
}) => {
  return (
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
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            <Button variant="link" className="p-0 h-auto text-xs" onClick={showTestCode}>
              Εμφάνιση δοκιμαστικού κωδικού (για ανάπτυξη)
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyCodeStep;
