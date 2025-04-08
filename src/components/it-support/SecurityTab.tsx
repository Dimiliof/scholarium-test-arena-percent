
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

type SecurityTabProps = {
  onAction: (action: string) => void;
};

const SecurityTab = ({ onAction }: SecurityTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Ασφάλεια
        </CardTitle>
        <CardDescription>Ρυθμίσεις και έλεγχοι ασφαλείας</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Διαχείριση ρυθμίσεων ασφαλείας, έλεγχος για ευπάθειες και διαχείριση πρόσβασης.</p>
        <Button 
          className="w-full mb-2"
          onClick={() => onAction("Έλεγχος ασφαλείας")}
        >
          Έλεγχος Ασφαλείας
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onAction("Ενημέρωση ρυθμίσεων firewall")}
        >
          Ρυθμίσεις Firewall
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
