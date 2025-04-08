
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Server } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ITSupportTabs from "@/components/it-support/ITSupportTabs";

const ITSupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Έλεγχος αν ο χρήστης είναι διαχειριστής
    if (!isAuthenticated || !isAdmin) {
      toast({
        variant: "destructive",
        title: "Πρόσβαση απορρίφθηκε",
        description: "Δεν έχετε δικαίωμα πρόσβασης σε αυτή τη σελίδα.",
      });
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Προσομοίωση ενεργειών διαχείρισης
  const handleSystemAction = (action: string) => {
    toast({
      title: "Ενέργεια IT Support",
      description: `Η ενέργεια "${action}" εκτελέστηκε επιτυχώς.`,
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Δεν εμφανίζουμε περιεχόμενο αν ο χρήστης δεν είναι διαχειριστής
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Server className="h-8 w-8 mr-2 text-primary" />
          Πίνακας Ελέγχου IT Support
        </h1>
        
        <ITSupportTabs onAction={handleSystemAction} />
      </div>
      <Footer />
    </div>
  );
};

export default ITSupportPage;
