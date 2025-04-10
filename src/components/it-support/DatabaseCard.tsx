
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, RefreshCcw, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type DatabaseCardProps = {
  onAction: (action: string) => void;
};

const DatabaseCard = ({ onAction }: DatabaseCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState("Σήμερα, 03:00");
  const [dbSize, setDbSize] = useState("124 MB");
  const [connections, setConnections] = useState(12);
  const [usagePercent, setUsagePercent] = useState(42);

  const handleBackup = () => {
    setIsLoading(true);
    onAction("Δημιουργία backup");
    
    // Simulate backup process
    setTimeout(() => {
      setLastBackupTime(`Σήμερα, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`);
      setIsLoading(false);
    }, 2000);
  };

  const handleOptimize = () => {
    setIsLoading(true);
    onAction("Βελτιστοποίηση βάσης");
    
    // Simulate optimization process
    setTimeout(() => {
      setDbSize(`${(parseInt(dbSize) - 8)} MB`);
      setUsagePercent(Math.max(usagePercent - 5, 10));
      setIsLoading(false);
    }, 3000);
  };

  const handleSecurityCheck = () => {
    setIsLoading(true);
    onAction("Έλεγχος ασφάλειας βάσης");
    
    // Simulate security check
    setTimeout(() => {
      setIsLoading(false);
      onAction("Ο έλεγχος ασφάλειας ολοκληρώθηκε με επιτυχία");
    }, 2500);
  };

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
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span>Χρήση αποθηκευτικού χώρου:</span>
              <span className="font-medium">{usagePercent}%</span>
            </div>
            <Progress value={usagePercent} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Μέγεθος Βάσης:</span>
            <span className="font-medium">{dbSize}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Τελευταίο Backup:</span>
            <span className="font-medium">{lastBackupTime}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Συνδέσεις:</span>
            <span className="font-medium">{connections} ενεργές</span>
          </div>
        </div>
        
        {isLoading && (
          <div className="mt-4 bg-blue-50 text-blue-700 p-2 rounded text-center text-sm">
            Η λειτουργία εκτελείται, παρακαλώ περιμένετε...
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleBackup}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Backup
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={handleOptimize}
          disabled={isLoading}
        >
          <Database className="h-4 w-4 mr-2" />
          Optimize
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={handleSecurityCheck}
          disabled={isLoading}
        >
          <Shield className="h-4 w-4 mr-2" />
          Ασφάλεια
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseCard;
