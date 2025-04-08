
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
  
  // Προσθήκη νέων καταστάσεων για τα modals
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

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
        // Έλεγχος αν είναι Android app ή PWA σε Android
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone && /Android/.test(navigator.userAgent)) {
          toast({
            title: "Είστε ήδη στην εφαρμογή",
            description: "Χρησιμοποιείτε ήδη την εφαρμογή Android.",
          });
        } else {
          // Εμφάνιση του Android modal
          setShowAndroidModal(true);
        }
      } else if (platform === 'iOS') {
        // Έλεγχος αν είναι iOS app ή PWA σε iOS
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          toast({
            title: "Είστε ήδη στην εφαρμογή",
            description: "Χρησιμοποιείτε ήδη την εφαρμογή iOS.",
          });
        } else {
          // Εμφάνιση του iOS modal
          setShowIOSModal(true);
        }
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

  // Διαχείριση λήψης APK για Android
  const handleAndroidDownload = () => {
    // Σύνδεσμος για το Play Store
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=app.edupercentage';
    
    // Σύνδεσμος για άμεση λήψη APK
    const apkUrl = 'https://edupercentage.s3.eu-central-1.amazonaws.com/releases/eduPercentage-latest.apk';
    
    // Έλεγχος αν η εφαρμογή είναι εγκατεστημένη ή αν τρέχει ως PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (/Samsung|SM-|SAMSUNG/.test(navigator.userAgent)) {
      // Για συσκευές Samsung δοκιμάζουμε πρώτα το Galaxy Store
      try {
        window.location.href = 'samsungapps://ProductDetail/app.edupercentage';
        setTimeout(() => {
          // Fallback στο Play Store αν δεν ανοίξει το Galaxy Store
          window.open(playStoreUrl, '_blank');
        }, 1000);
      } catch (e) {
        window.open(playStoreUrl, '_blank');
      }
    } else {
      // Άλλες συσκευές Android
      if (/Android/.test(navigator.userAgent)) {
        // Άνοιγμα στο Play Store
        window.open(playStoreUrl, '_blank');
        
        toast({
          title: "Μετάβαση στο Play Store",
          description: "Ανοίγει το Google Play Store για εγκατάσταση της εφαρμογής EduPercentage.",
        });
      } else {
        // Για desktop υπολογιστές που θέλουν να κατεβάσουν το APK
        toast({
          title: "Λήψη APK",
          description: "Η λήψη του αρχείου APK ξεκίνησε. Μετά την ολοκλήρωση, μεταφέρετε το στην Android συσκευή σας.",
        });
        
        // Δημιουργία του συνδέσμου λήψης προγραμματιστικά
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'eduPercentage.apk';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Κάνουμε "κλικ" στο σύνδεσμο για να ξεκινήσει η λήψη
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    
    // Κλείσιμο του modal μετά την ενέργεια
    setShowAndroidModal(false);
  };

  // Άνοιγμα στο App Store για iOS
  const handleIOSAppStore = () => {
    const appStoreUrl = 'https://apps.apple.com/app/edupercentage/id1234567890';
    window.open(appStoreUrl, '_blank');
    
    toast({
      title: "Μετάβαση στο App Store",
      description: "Μεταφέρεστε στο App Store για να εγκαταστήσετε την εφαρμογή EduPercentage.",
    });
    
    setShowIOSModal(false);
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

  // Περιεχόμενο για το Android modal
  const getAndroidModalContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Smartphone className="h-16 w-16 text-indigo-500 mb-2" />
          <h3 className="text-lg font-bold">Λήψη για Android</h3>
        </div>
        
        <p className="text-center mb-4">
          Κατεβάστε την εφαρμογή EduPercentage για Android. Μετά τη λήψη, ανοίξτε το αρχείο για να ξεκινήσει η εγκατάσταση.
        </p>
        
        <div className="space-y-2 text-left bg-amber-50 p-3 rounded-md border border-amber-200">
          <p className="font-medium text-amber-800 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Σημαντικές πληροφορίες:
          </p>
          <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
            <li>Ίσως χρειαστεί να επιτρέψετε την εγκατάσταση από άγνωστες πηγές στις ρυθμίσεις της συσκευής σας.</li>
            <li>Η εφαρμογή είναι ασφαλής και δεν περιέχει κακόβουλο λογισμικό.</li>
            <li>Μέγεθος εφαρμογής: περίπου 15MB</li>
          </ul>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700" 
            onClick={handleAndroidDownload}
          >
            <Download className="mr-2 h-4 w-4" /> Λήψη APK (15MB)
          </Button>
        </div>
      </div>
    );
  };

  // Περιεχόμενο για το iOS modal
  const getIOSModalContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Apple className="h-16 w-16 text-indigo-500 mb-2" />
          <h3 className="text-lg font-bold">Λήψη για iOS</h3>
        </div>
        
        <p className="text-center mb-4">
          Κατεβάστε την εφαρμογή EduPercentage για iOS από το App Store.
        </p>
        
        <div className="space-y-2 text-left bg-blue-50 p-3 rounded-md border border-blue-200">
          <p className="font-medium text-blue-800 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Χαρακτηριστικά της εφαρμογής:
          </p>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li>Πλήρης πρόσβαση σε όλες τις λειτουργίες offline</li>
            <li>Ειδοποιήσεις για νέα τεστ και εκπαιδευτικό υλικό</li>
            <li>Βελτιστοποιημένο περιβάλλον για iOS συσκευές</li>
            <li>Συμβατότητα με iOS 12.0 και νεότερες εκδόσεις</li>
          </ul>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700" 
            onClick={handleIOSAppStore}
          >
            <Apple className="mr-2 h-4 w-4" /> Άνοιγμα στο App Store
          </Button>
        </div>
      </div>
    );
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
              <span>Android (Play Store)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('iOS')}>
              <Apple className="mr-2 h-4 w-4" />
              <span>iOS (App Store)</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDownload('PWA')}
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

      {/* Dialog για οδηγίες εγκατάστασης */}
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

      {/* Dialog για Android λήψη */}
      <Dialog open={showAndroidModal} onOpenChange={setShowAndroidModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Λήψη για Android</DialogTitle>
            <DialogDescription>
              Εγκαταστήστε την εφαρμογή EduPercentage στη συσκευή Android σας.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getAndroidModalContent()}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setShowAndroidModal(false)}>
              Ακύρωση
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog για iOS λήψη */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Λήψη για iOS</DialogTitle>
            <DialogDescription>
              Εγκαταστήστε την εφαρμογή EduPercentage στη συσκευή iOS σας.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getIOSModalContent()}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setShowIOSModal(false)}>
              Ακύρωση
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadAppButton;
