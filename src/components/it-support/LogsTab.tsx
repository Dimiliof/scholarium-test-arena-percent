
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

type LogsTabProps = {
  onAction: (action: string) => void;
};

const LogsTab = ({ onAction }: LogsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Καταγραφές Συστήματος
        </CardTitle>
        <CardDescription>Προβολή και ανάλυση καταγραφών συστήματος</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Εδώ μπορείτε να δείτε τις καταγραφές του συστήματος, συμβάντα ασφαλείας και άλλες σημαντικές πληροφορίες.</p>
        <Button 
          className="w-full mb-2"
          onClick={() => onAction("Προβολή καταγραφών συστήματος")}
        >
          Προβολή Καταγραφών
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onAction("Λήψη αναφοράς καταγραφών")}
        >
          Εξαγωγή Αναφοράς
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogsTab;
