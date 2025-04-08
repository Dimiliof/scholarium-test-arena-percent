
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Apple, Laptop, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Ορισμός τύπου για το BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

const DownloadAppButton = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Έλεγχος αν είναι συσκευή iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOSDevice(isIOS);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Αποτροπή αυτόματης εμφάνισης του prompt στο Chrome
      e.preventDefault();
      // Αποθήκευση του event για μεταγενέστερη χρήση
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('Το PWA είναι διαθέσιμο για εγκατάσταση');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Έλεγχος αν η εφαρμογή είναι ήδη εγκατεστημένη
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      console.log('Η εφαρμογή είναι ήδη εγκατεστημένη');
    }

    // Έλεγχος αν η εγκατάσταση ολοκληρώθηκε
    window.addEventListener('appinstalled', (e) => {
      console.log('Η εφαρμογή εγκαταστάθηκε επιτυχώς', e);
      toast({
        title: "Εγκατάσταση Ολοκληρώθηκε",
        description: "Η εφαρμογή προστέθηκε επιτυχώς στην αρχική σας οθόνη.",
      });
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, [toast]);

  const handleDownload = async (platform: string) => {
    setIsDownloading(true);
    
    try {
      if (platform === 'Android') {
        // Σύνδεσμος για λήψη του APK
        window.open('https://example.com/eduPercentage.apk', '_blank');
        toast({
          title: "Λήψη για Android",
          description: "Η λήψη της εφαρμογής για Android ξεκίνησε.",
        });
      } else if (platform === 'iOS') {
        // Σύνδεσμος για το App Store
        window.open('https://apps.apple.com/app/example', '_blank');
        toast({
          title: "Λήψη για iOS",
          description: "Μεταφέρεστε στο App Store για εγκατάσταση της εφαρμογής.",
        });
      } else if (platform === 'PWA') {
        // Λογική εγκατάστασης PWA
        if (deferredPrompt) {
          // Εμφάνιση του prompt εγκατάστασης
          await deferredPrompt.prompt();
          
          // Αναμονή για την απάντηση του χρήστη
          const choiceResult = await deferredPrompt.userChoice;
          
          if (choiceResult.outcome === 'accepted') {
            console.log('Ο χρήστης αποδέχτηκε την εγκατάσταση του PWA');
            toast({
              title: "Επιτυχής Εγκατάσταση",
              description: "Η εφαρμογή προστέθηκε στην αρχική οθόνη της συσκευής σας.",
            });
          } else {
            console.log('Ο χρήστης απέρριψε την εγκατάσταση του PWA');
            toast({
              title: "Ακύρωση Εγκατάστασης",
              description: "Μπορείτε να προσθέσετε την εφαρμογή αργότερα από το κουμπί λήψης.",
            });
          }
          
          // Το prompt μπορεί να χρησιμοποιηθεί μόνο μία φορά
          setDeferredPrompt(null);
        } else if (isIOSDevice) {
          // Εμφάνιση οδηγιών για iOS
          setShowInstallGuide(true);
        } else {
          toast({
            title: "Πληροφορία",
            description: "Η εφαρμογή είναι ήδη εγκατεστημένη ή ο browser σας δεν υποστηρίζει την άμεση εγκατάσταση. Πατήστε το κουμπί Βοήθεια για οδηγίες.",
          });
        }
      } else if (platform === 'Help') {
        setShowInstallGuide(true);
      }
    } catch (error) {
      console.error('Σφάλμα κατά την εγκατάσταση της εφαρμογής:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την εγκατάσταση. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Οδηγίες εγκατάστασης ανάλογα με το περιηγητή/συσκευή
  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return (
        <div className="space-y-4 text-left">
          <h4 className="font-semibold">Οδηγίες για iOS:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Πατήστε το εικονίδιο <span className="inline-block px-2 py-1 bg-gray-100 rounded">Μοιραστείτε</span> στο κάτω μέρος της οθόνης του Safari</li>
            <li>Κυλήστε προς τα κάτω και πατήστε <span className="inline-block px-2 py-1 bg-gray-100 rounded">Προσθήκη στην αρχική οθόνη</span></li>
            <li>Στο παράθυρο που θα εμφανιστεί, πατήστε <span className="inline-block px-2 py-1 bg-gray-100 rounded">Προσθήκη</span></li>
            <li>Η εφαρμογή θα προστεθεί στην αρχική οθόνη σας!</li>
          </ol>
          <p className="text-sm text-gray-500 mt-2">Σημείωση: Η διαδικασία αυτή λειτουργεί μόνο στον Safari.</p>
        </div>
      );
    } else if (/Android/.test(userAgent)) {
      return (
        <div className="space-y-4 text-left">
          <h4 className="font-semibold">Οδηγίες για Android:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ανοίξτε το μενού του Chrome (τρεις τελείες στην πάνω δεξιά γωνία)</li>
            <li>Επιλέξτε <span className="inline-block px-2 py-1 bg-gray-100 rounded">Εγκατάσταση εφαρμογής</span> ή <span className="inline-block px-2 py-1 bg-gray-100 rounded">Προσθήκη στην αρχική οθόνη</span></li>
            <li>Στο παράθυρο που θα εμφανιστεί, πατήστε <span className="inline-block px-2 py-1 bg-gray-100 rounded">Εγκατάσταση</span></li>
          </ol>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 text-left">
          <h4 className="font-semibold">Οδηγίες για Desktop:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Στο Chrome ή Edge, κάντε κλικ στο εικονίδιο εγκατάστασης (✚) στη γραμμή διευθύνσεων</li>
            <li>Εναλλακτικά, ανοίξτε το μενού του περιηγητή σας και επιλέξτε <span className="inline-block px-2 py-1 bg-gray-100 rounded">Εγκατάσταση EduPercentage</span></li>
            <li>Επιβεβαιώστε την εγκατάσταση στο αναδυόμενο παράθυρο</li>
          </ol>
          <p className="text-sm text-gray-500 mt-2">Σημείωση: Αν δεν εμφανίζεται αυτή η επιλογή, η εφαρμογή μπορεί να είναι ήδη εγκατεστημένη ή ο περιηγητής σας να μην υποστηρίζει αυτή τη λειτουργία.</p>
        </div>
      );
    }
  };

  return (
    <>
      <div className="fixed right-6 bottom-6 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full h-14 w-14 md:h-16 md:w-16 shadow-lg" size="icon">
              {isDownloading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Download className="h-6 w-6 md:h-7 md:w-7" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleDownload('Android')}>
              <Smartphone className="mr-2 h-4 w-4" />
              <span>Android (.apk)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('iOS')}>
              <Apple className="mr-2 h-4 w-4" />
              <span>iOS (App Store)</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDownload('PWA')}
              disabled={!showInstallButton && !isIOSDevice}
            >
              <Laptop className="mr-2 h-4 w-4" />
              <span>Προσθήκη στην αρχική οθόνη</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDownload('Help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Βοήθεια εγκατάστασης</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showInstallGuide} onOpenChange={setShowInstallGuide}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Οδηγίες Προσθήκης στην Αρχική Οθόνη</DialogTitle>
            <DialogDescription>
              Ακολουθήστε τα παρακάτω βήματα για να προσθέσετε την εφαρμογή στην αρχική οθόνη της συσκευής σας.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getInstallInstructions()}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setShowInstallGuide(false)}>
              Κατάλαβα
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadAppButton;
