
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type UsersTabProps = {
  onAction: (action: string) => void;
};

const UsersTab = ({ onAction }: UsersTabProps) => {
  const { fixAdminEmail } = useAuth();
  const { toast } = useToast();

  const handleFixAdmin = async () => {
    const adminEmail = "liofisdimitris@gmail.com";
    const success = await fixAdminEmail(adminEmail);
    
    if (success) {
      toast({
        title: "Επιτυχής ενημέρωση",
        description: `Ο χρήστης ${adminEmail} ορίστηκε ως διαχειριστής επιτυχώς.`,
      });
      onAction("Όρισμός διαχειριστή");
    } else {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Προέκυψε πρόβλημα κατά την ενημέρωση του ρόλου.",
      });
    }
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
          className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          onClick={handleFixAdmin}
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          Όρισε Διαχειριστή
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
