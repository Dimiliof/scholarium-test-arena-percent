
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";

type SystemStatusCardProps = {
  onAction: (action: string) => void;
};

const SystemStatusCard = ({ onAction }: SystemStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 mr-2 text-primary" />
          Κατάσταση Συστήματος
        </CardTitle>
        <CardDescription>Έλεγχος και διαχείριση βασικών λειτουργιών</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span>Κατάσταση Βάσης Δεδομένων:</span>
          <span className="text-green-500 font-medium">Ενεργή</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Κατάσταση Web Server:</span>
          <span className="text-green-500 font-medium">Ενεργός</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Χρήση Μνήμης:</span>
          <span className="text-blue-500 font-medium">32%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onAction("Επανεκκίνηση υπηρεσιών")}
        >
          Επανεκκίνηση Υπηρεσιών
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemStatusCard;
