
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Apple, Laptop } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const DownloadAppButton = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = (platform: string) => {
    setIsDownloading(true);
    
    // Προσομοίωση καθυστέρησης λήψης
    setTimeout(() => {
      setIsDownloading(false);
      
      toast({
        title: `Λήψη για ${platform}`,
        description: platform === 'Web' 
          ? "Η εφαρμογή προστέθηκε στην αρχική οθόνη." 
          : `Η λήψη της εφαρμογής για ${platform} ξεκίνησε.`,
      });
      
      if (platform === 'Android') {
        // Σύνδεσμος για λήψη του APK (θα χρειαστεί να αντικατασταθεί με πραγματικό σύνδεσμο)
        window.open('https://example.com/eduPercentage.apk', '_blank');
      } else if (platform === 'iOS') {
        // Σύνδεσμος για το App Store (θα χρειαστεί να αντικατασταθεί με πραγματικό σύνδεσμο)
        window.open('https://apps.apple.com/app/example', '_blank');
      } else if (platform === 'Web') {
        // Λογική για PWA εγκατάσταση
        if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
          console.log('Η εφαρμογή μπορεί να εγκατασταθεί ως PWA');
          // Εδώ θα μπορούσε να προστεθεί λογική για την εμφάνιση του PWA prompt
        }
      }
    }, 1000);
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
          <DropdownMenuItem onClick={() => handleDownload('Web')}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>Προσθήκη στην αρχική οθόνη</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DownloadAppButton;
