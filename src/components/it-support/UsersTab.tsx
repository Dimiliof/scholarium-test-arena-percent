
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

type UsersTabProps = {
  onAction: (action: string) => void;
};

const UsersTab = ({ onAction }: UsersTabProps) => {
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
          className="w-full"
          onClick={() => onAction("Έλεγχος δικαιωμάτων")}
        >
          Έλεγχος Δικαιωμάτων
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
