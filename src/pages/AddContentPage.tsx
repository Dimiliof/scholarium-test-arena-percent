
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import VerificationStep from '@/components/add-content/VerificationStep';
import VerifyCodeStep from '@/components/add-content/VerifyCodeStep';
import VerifiedBanner from '@/components/add-content/VerifiedBanner';
import ContentTypeSelector from '@/components/add-content/ContentTypeSelector';
import SubjectSelector from '@/components/add-content/SubjectSelector';
import ContentForm from '@/components/add-content/ContentForm';

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
  const [contentType, setContentType] = useState<'question' | 'resource'>('question');
  
  useEffect(() => {
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
  }, []);
  
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

  const handleResourceAdded = () => {
    toast({
      title: "Επιτυχής προσθήκη!",
      description: "Ο εκπαιδευτικός πόρος προστέθηκε επιτυχώς στο σύστημα.",
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
    
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('verify');
      
      if (verificationMethod === 'email') {
        toast({
          title: "Κωδικός εστάλη στο email σας",
          description: `Ένας 6-ψήφιος κωδικός επαλήθευσης έχει σταλεί στο ${emailInput}. Παρακαλώ ελέγξτε τα εισερχόμενά σας.`,
        });
        
        import('sonner').then(({ toast: sonnerToast }) => {
          sonnerToast.success(`Κωδικός επαλήθευσης εστάλη στο ${emailInput}`);
        });
        
        console.log(`Κωδικός επαλήθευσης εστάλη στο ${emailInput}`);
      } else {
        toast({
          title: "SMS εστάλη",
          description: `Ένα SMS με τον 6-ψήφιο κωδικό επαλήθευσης έχει σταλεί στο ${phoneInput}.`,
        });
        
        import('sonner').then(({ toast: sonnerToast }) => {
          sonnerToast.success(`Κωδικός επαλήθευσης εστάλη στο ${phoneInput}`);
        });
        
        console.log(`Κωδικός επαλήθευσης εστάλη στο ${phoneInput}`);
      }
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (!otpCode || otpCode.length < 6) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε έναν έγκυρο 6-ψήφιο κωδικό επαλήθευσης.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      
      if (otpCode === "123456") {
        setVerificationStep('verified');
        
        localStorage.setItem('educatorVerified', 'true');
        localStorage.setItem('educatorEmail', verificationMethod === 'email' ? emailInput : '');
        localStorage.setItem('educatorPhone', verificationMethod === 'sms' ? phoneInput : '');
        
        toast({
          title: "Επιτυχής επαλήθευση!",
          description: "Έχετε πλέον πρόσβαση στην προσθήκη εκπαιδευτικού υλικού.",
        });
        
        import('sonner').then(({ toast: sonnerToast }) => {
          sonnerToast.success("Επιτυχής επαλήθευση!");
        });
      } else {
        toast({
          title: "Λάθος κωδικός",
          description: "Ο κωδικός που εισάγατε δεν είναι σωστός. Παρακαλώ δοκιμάστε ξανά.",
          variant: "destructive",
        });
        
        import('sonner').then(({ toast: sonnerToast }) => {
          sonnerToast.error("Λάθος κωδικός επαλήθευσης");
        });
      }
    }, 1500);
  };

  const showTestCode = () => {
    toast({
      title: "Δοκιμαστικός Κωδικός",
      description: "Ο δοκιμαστικός κωδικός είναι: 123456",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Προσθήκη Υλικού</h1>
        
        {verificationStep === 'initial' && (
          <VerificationStep
            verificationMethod={verificationMethod}
            emailInput={emailInput}
            phoneInput={phoneInput}
            isVerifying={isVerifying}
            setVerificationMethod={setVerificationMethod}
            setEmailInput={setEmailInput}
            setPhoneInput={setPhoneInput}
            handleSendVerification={handleSendVerification}
            showTestCode={showTestCode}
          />
        )}

        {verificationStep === 'verify' && (
          <VerifyCodeStep
            verificationMethod={verificationMethod}
            emailInput={emailInput}
            phoneInput={phoneInput}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isVerifying={isVerifying}
            handleVerifyCode={handleVerifyCode}
            handleBack={handleBack}
            handleSendVerification={handleSendVerification}
            showTestCode={showTestCode}
          />
        )}

        {verificationStep === 'verified' && !selectedSubject && (
          <>
            <VerifiedBanner />
            
            <ContentTypeSelector 
              contentType={contentType}
              setContentType={setContentType}
            />
            
            <SubjectSelector onSelectSubject={handleSubjectSelect} />
          </>
        )}
        
        {verificationStep === 'verified' && selectedSubject && (
          <ContentForm
            contentType={contentType}
            selectedSubject={selectedSubject}
            handleBack={handleBack}
            handleQuestionAdded={handleQuestionAdded}
            handleResourceAdded={handleResourceAdded}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AddContentPage;
