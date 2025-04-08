
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

type DatabaseCardProps = {
  onAction: (action: string) => void;
};

const DatabaseCard = ({ onAction }: DatabaseCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-primary" />
          Βάση Δεδομένων
        </CardTitle>
        <CardDescription>Διαχείριση και έλεγχος βάσης δεδομένων</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span>Μέγεθος Βάσης:</span>
          <span className="font-medium">124 MB</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Τελευταίο Backup:</span>
          <span className="font-medium">Σήμερα, 03:00</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Συνδέσεις:</span>
          <span className="font-medium">12 ενεργές</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="flex-1 mr-2"
          onClick={() => onAction("Δημιουργία backup")}
        >
          Backup
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => onAction("Βελτιστοποίηση βάσης")}
        >
          Optimize
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseCard;
