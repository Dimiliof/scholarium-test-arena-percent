
import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GoogleFormOptionProps {
  useGoogleForm: boolean;
  setUseGoogleForm: (value: boolean) => void;
  googleFormUrl: string;
}

const GoogleFormOption: React.FC<GoogleFormOptionProps> = ({ 
  useGoogleForm, 
  setUseGoogleForm, 
  googleFormUrl 
}) => {
  return (
    <>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Επιλογή μεθόδου υποβολής</AlertTitle>
        <AlertDescription>
          Έχετε τώρα τη δυνατότητα να υποβάλετε υλικό είτε μέσω της εφαρμογής είτε μέσω φόρμας Google. 
          Η φόρμα Google διασφαλίζει ότι το υλικό δεν θα χαθεί και αποθηκεύεται μόνιμα.
        </AlertDescription>
        <div className="flex gap-4 mt-4">
          <Button 
            variant={useGoogleForm ? "outline" : "default"} 
            onClick={() => setUseGoogleForm(false)}
            className="flex-1"
          >
            Υποβολή στην εφαρμογή
          </Button>
          <Button 
            variant={useGoogleForm ? "default" : "outline"} 
            onClick={() => setUseGoogleForm(true)}
            className="flex-1"
          >
            Υποβολή μέσω Google Form
          </Button>
        </div>
      </Alert>
      
      {useGoogleForm && (
        <div className="text-center space-y-6 py-8">
          <h3 className="text-xl font-medium">Υποβολή υλικού μέσω Google Form</h3>
          <p className="text-muted-foreground">
            Θα ανακατευθυνθείτε σε μια φόρμα Google για την υποβολή του εκπαιδευτικού υλικού σας. 
            Το υλικό που υποβάλλεται μέσω της φόρμας αποθηκεύεται σε ασφαλή βάση δεδομένων και 
            δεν θα χαθεί ακόμα και αν διαγράψετε τα cookies του φυλλομετρητή σας.
          </p>
          
          <Alert className="bg-amber-50 border-amber-200 text-left">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertTitle>Περιορισμένη Πρόσβαση</AlertTitle>
            <AlertDescription>
              Οι μαθητές που επισκέπτονται τους συνδέσμους Google Drive θα έχουν πρόσβαση μόνο στο περιεχόμενο 
              που τους έχει παρασχεθεί και δεν θα μπορούν να περιηγηθούν σε άλλο περιεχόμενο πέρα από αυτό που έχει οριστεί.
              Το περιεχόμενο είναι διαθέσιμο μόνο για προβολή και όχι για επεξεργασία ή λήψη εκτός αν αυτό έχει επιτραπεί ρητά.
            </AlertDescription>
          </Alert>
          
          <Button 
            size="lg" 
            onClick={() => window.open(googleFormUrl, '_blank')}
          >
            Μετάβαση στη φόρμα Google
          </Button>
        </div>
      )}
    </>
  );
};

export default GoogleFormOption;
