
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DriveFile } from "@/components/resources/form/UploadTypeSelection";
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, Check } from "lucide-react";

declare global {
  interface Window {
    gapi: any;
    google: any;
    googleDriveLoaded: boolean;
    handleApiLoad?: () => void;
  }
}

interface GoogleDriveUploaderProps {
  onFileSelected: (file: DriveFile) => void;
}

const GoogleDriveUploader: React.FC<GoogleDriveUploaderProps> = ({ onFileSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  // Το Google API Client ID (από το Google Cloud Console)
  const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
  const API_KEY = 'YOUR_API_KEY_HERE';
  
  // Τα scopes που χρειαζόμαστε
  const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly';

  useEffect(() => {
    loadGoogleDriveAPI();
  }, []);

  const loadGoogleDriveAPI = () => {
    if (window.gapi) {
      initGapiClient();
    } else {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initGapiClient;
      document.body.appendChild(script);
    }
  };

  const initGapiClient = () => {
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        });
        setGapiLoaded(true);
        
        // Έλεγχος αν ο χρήστης είναι ήδη συνδεδεμένος
        if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Σφάλμα κατά την αρχικοποίηση του Google API:', error);
        toast.error('Σφάλμα σύνδεσης με το Google Drive');
      }
    });
  };

  const handleSignIn = async () => {
    if (!gapiLoaded) {
      toast.error('Το Google API δεν είναι διαθέσιμο. Παρακαλώ δοκιμάστε ξανά.');
      return;
    }

    try {
      const authResponse = await window.gapi.auth2.getAuthInstance().signIn();
      if (authResponse) {
        setIsAuthenticated(true);
        toast.success('Επιτυχής σύνδεση με το Google Drive');
      }
    } catch (error) {
      console.error('Σφάλμα κατά τη σύνδεση με το Google Drive:', error);
      toast.error('Αποτυχία σύνδεσης με το Google Drive');
    }
  };

  const handleSignOut = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signOut();
      setIsAuthenticated(false);
      toast.success('Αποσυνδεθήκατε από το Google Drive');
    } catch (error) {
      console.error('Σφάλμα κατά την αποσύνδεση από το Google Drive:', error);
    }
  };

  const openFilePicker = () => {
    setIsLoading(true);
    
    // Δημιουργία του picker
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.PRESENTATIONS)
      .addView(window.google.picker.ViewId.SPREADSHEETS)
      .addView(window.google.picker.ViewId.PDFS)
      .addView(window.google.picker.ViewId.DOCS_IMAGES)
      .addView(window.google.picker.ViewId.DOCS_VIDEOS)
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
      
    picker.setVisible(true);
    setIsLoading(false);
  };

  const pickerCallback = async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const document = data.docs[0];
      
      try {
        // Λαμβάνουμε περισσότερες πληροφορίες για το αρχείο
        const fileResponse = await window.gapi.client.drive.files.get({
          fileId: document.id,
          fields: 'id, name, mimeType, webViewLink, webContentLink, iconLink, thumbnailLink'
        });
        
        const file = fileResponse.result;
        
        // Δημιουργία ενός αντικειμένου με τις πληροφορίες του αρχείου
        const driveFile: DriveFile = {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          viewLink: file.webViewLink,
          downloadLink: file.webContentLink || file.webViewLink,
          iconLink: file.iconLink,
          thumbnailLink: file.thumbnailLink || file.iconLink,
          source: 'google-drive'
        };
        
        onFileSelected(driveFile);
        toast.success(`Το αρχείο "${file.name}" επιλέχθηκε επιτυχώς`);
      } catch (error) {
        console.error('Σφάλμα κατά τη λήψη πληροφοριών αρχείου:', error);
        toast.error('Σφάλμα κατά την επιλογή αρχείου');
      }
    } else if (data.action === window.google.picker.Action.CANCEL) {
      toast.info('Η επιλογή αρχείου ακυρώθηκε');
    }
  };

  // Φόρτωση του Google Picker API
  const loadPickerAPI = () => {
    if (!window.google || !window.google.picker) {
      // Δημιουργία μιας καθολικής συνάρτησης χειρισμού για την απόκριση του API
      window.handleApiLoad = () => {
        window.gapi.load('picker', { callback: () => {} });
      };
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js?onload=handleApiLoad';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPickerAPI();
    }
  }, [isAuthenticated]);

  if (!gapiLoaded) {
    return (
      <Alert className="bg-blue-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Φόρτωση Google Drive API</AlertTitle>
        <AlertDescription>
          Παρακαλώ περιμένετε καθώς φορτώνουμε το Google Drive API...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={handleSignIn} 
          disabled={isLoading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Σύνδεση με Google Drive
        </Button>
      ) : (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Επιτυχής σύνδεση</AlertTitle>
            <AlertDescription>
              Έχετε συνδεθεί επιτυχώς με το Google Drive. Μπορείτε να επιλέξετε αρχεία για ανέβασμα.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              className="flex-1" 
              onClick={openFilePicker} 
              disabled={isLoading}
            >
              Επιλογή αρχείου από το Drive
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSignOut} 
              disabled={isLoading}
            >
              Αποσύνδεση
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveUploader;
