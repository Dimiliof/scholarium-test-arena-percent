
import { useEffect, useState } from "react";
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
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ITSupportPage - Auth State:", { isAuthenticated, isAdmin, user });
    
    // Έλεγχος αν ο χρήστης είναι διαχειριστής
    const checkAccess = () => {
      if (!isAuthenticated) {
        console.log("ITSupportPage - User not authenticated");
        toast({
          variant: "destructive",
          title: "Πρόσβαση απορρίφθηκε",
          description: "Πρέπει να συνδεθείτε για να έχετε πρόσβαση σε αυτή τη σελίδα.",
        });
        navigate("/login");
        return;
      }
      
      // Έλεγχος από το localStorage για επιπλέον ασφάλεια
      const storedUser = localStorage.getItem("user");
      const userFromStorage = storedUser ? JSON.parse(storedUser) : null;
      
      const isUserAdmin = userFromStorage ? 
        (userFromStorage.role === "admin" || 
        (userFromStorage.roles && userFromStorage.roles.includes("admin")) || 
        userFromStorage.email === "liofisdimitris@gmail.com") : false;
      
      if (!isAdmin && !isUserAdmin) {
        console.log("ITSupportPage - User not admin:", { isAdmin, storageCheck: isUserAdmin });
        toast({
          variant: "destructive",
          title: "Πρόσβαση απορρίφθηκε",
          description: "Μόνο οι διαχειριστές έχουν πρόσβαση σε αυτή τη σελίδα.",
        });
        navigate("/");
        return;
      }
      
      // Αν φτάσουμε εδώ, ο χρήστης έχει πρόσβαση
      console.log("ITSupportPage - User has access");
      setLoading(false);
    };
    
    checkAccess();
  }, [isAuthenticated, isAdmin, navigate, toast, user]);

  // Προσομοίωση ενεργειών διαχείρισης
  const handleSystemAction = (action: string) => {
    toast({
      title: "Ενέργεια IT Support",
      description: `Η ενέργεια "${action}" εκτελέστηκε επιτυχώς.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <p className="text-xl">Φόρτωση...</p>
        </div>
        <Footer />
      </div>
    );
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
