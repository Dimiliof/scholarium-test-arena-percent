
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { toast } from "sonner";

type UsersTabProps = {
  onAction: (action: string) => void;
};

const UsersTab = ({ onAction }: UsersTabProps) => {
  const { fixAdminEmail, makeUserTeacherAndAdmin } = useAuth();
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFixAdmin = async () => {
    setIsLoading(true);
    const adminEmail = "liofisdimitris@gmail.com";
    const success = await makeUserTeacherAndAdmin(adminEmail);
    
    if (success) {
      uiToast({
        title: "Επιτυχής ενημέρωση",
        description: `Ο χρήστης ${adminEmail} ορίστηκε ως διαχειριστής και εκπαιδευτικός επιτυχώς.`,
      });
      
      toast.success("Ορισμός διπλού ρόλου επιτυχής!", {
        position: "top-center",
      });
      
      onAction("Όρισμός διπλού ρόλου");
    } else {
      uiToast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Προέκυψε πρόβλημα κατά την ενημέρωση του ρόλου.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Διαχείριση Χρηστών
        </CardTitle>
        <CardDescription>Διαχείριση λογαριασμών και δικαιωμάτων χρηστών</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Εδώ μπορείτε να διαχειριστείτε τους χρήστες του συστήματος, να ορίσετε δικαιώματα και να εκτελέσετε διοικητικές ενέργειες.</p>
        <Button 
          className="w-full mb-2"
          onClick={() => onAction("Προβολή λίστας χρηστών")}
        >
          Προβολή Όλων των Χρηστών
        </Button>
        <Button 
          variant="outline" 
          className="w-full mb-2"
          onClick={() => onAction("Έλεγχος δικαιωμάτων")}
        >
          Έλεγχος Δικαιωμάτων
        </Button>
        <Button 
          variant="outline" 
          className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 mb-2"
          onClick={handleFixAdmin}
          disabled={isLoading}
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          <BookOpen className="h-4 w-4 mr-2" />
          {isLoading ? "Ορισμός..." : "Όρισε Διαχειριστή & Εκπαιδευτικό"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
