
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Apple, Laptop } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Define a proper type for the BeforeInstallPromptEvent
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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Save the event for later use
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('PWA installation prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      console.log('Application is already installed');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
      } else if (platform === 'Web') {
        // PWA installation logic
        if (deferredPrompt) {
          // Show the installation prompt
          await deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          const choiceResult = await deferredPrompt.userChoice;
          
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA installation');
            toast({
              title: "Επιτυχής Εγκατάσταση",
              description: "Η εφαρμογή προστέθηκε στην αρχική οθόνη της συσκευής σας.",
            });
          } else {
            console.log('User declined the PWA installation');
            toast({
              title: "Ακύρωση Εγκατάστασης",
              description: "Μπορείτε να προσθέσετε την εφαρμογή αργότερα από το κουμπί λήψης.",
            });
          }
          
          // The prompt can only be used once, so clear it
          setDeferredPrompt(null);
          setShowInstallButton(false);
        } else {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          
          if (isIOS) {
            toast({
              title: "Οδηγίες για iOS",
              description: "Πατήστε το κουμπί 'Μοιραστείτε' και μετά 'Προσθήκη στην αρχική οθόνη'.",
            });
          } else {
            toast({
              title: "Πληροφορία",
              description: "Η εφαρμογή είναι ήδη εγκατεστημένη ή ο browser σας δεν υποστηρίζει την άμεση εγκατάσταση. Χρησιμοποιήστε τις ρυθμίσεις του browser για προσθήκη στην αρχική οθόνη.",
            });
          }
        }
      }
    } catch (error) {
      console.error('Error during app installation:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την εγκατάσταση. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
            onClick={() => handleDownload('Web')}
            disabled={!showInstallButton && !(/iPad|iPhone|iPod/.test(navigator.userAgent))}
          >
            <Laptop className="mr-2 h-4 w-4" />
            <span>Προσθήκη στην αρχική οθόνη</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DownloadAppButton;
