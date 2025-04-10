
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, RefreshCcw, Shield, ArrowUpDown, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type DatabaseCardProps = {
  onAction: (action: string) => void;
};

const DatabaseCard = ({ onAction }: DatabaseCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState("Σήμερα, 03:00");
  const [dbSize, setDbSize] = useState("124 MB");
  const [connections, setConnections] = useState(12);
  const [usagePercent, setUsagePercent] = useState(42);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [performanceIndex, setPerformanceIndex] = useState(78);

  useEffect(() => {
    // Simulate real-time connection changes
    const connectionInterval = setInterval(() => {
      setConnections(prev => Math.max(8, Math.min(20, prev + Math.floor(Math.random() * 3) - 1)));
    }, 5000);

    return () => clearInterval(connectionInterval);
  }, []);

  const handleBackup = () => {
    setIsLoading(true);
    onAction("Δημιουργία backup");
    
    toast.info("Δημιουργία αντιγράφου ασφαλείας σε εξέλιξη...");
    
    // Simulate backup process
    setTimeout(() => {
      setLastBackupTime(`Σήμερα, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`);
      setIsLoading(false);
      toast.success("Το αντίγραφο ασφαλείας δημιουργήθηκε με επιτυχία!");
    }, 2000);
  };

  const handleOptimize = () => {
    setIsLoading(true);
    onAction("Βελτιστοποίηση βάσης");
    
    toast.info("Βελτιστοποίηση βάσης δεδομένων σε εξέλιξη...");
    
    // Simulate optimization process
    setTimeout(() => {
      const newSize = parseInt(dbSize) - 8;
      setDbSize(`${newSize} MB`);
      setUsagePercent(Math.max(usagePercent - 5, 10));
      setPerformanceIndex(Math.min(performanceIndex + 7, 95));
      setIsLoading(false);
      toast.success("Η βάση δεδομένων βελτιστοποιήθηκε με επιτυχία!");
    }, 3000);
  };

  const handleSecurityCheck = () => {
    setIsLoading(true);
    onAction("Έλεγχος ασφάλειας βάσης");
    
    toast.info("Έλεγχος ασφάλειας σε εξέλιξη...");
    
    // Simulate security check
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Ο έλεγχος ασφάλειας ολοκληρώθηκε με επιτυχία", {
        description: "Δεν βρέθηκαν προβλήματα ασφαλείας",
        icon: <Shield className="h-4 w-4 text-green-500" />
      });
      onAction("Ο έλεγχος ασφάλειας ολοκληρώθηκε με επιτυχία");
    }, 2500);
  };

  const toggleDetailedInfo = () => {
    setShowDetailedInfo(!showDetailedInfo);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
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
              <span className={`font-medium ${usagePercent > 80 ? 'text-red-500' : usagePercent > 60 ? 'text-amber-500' : 'text-green-600'}`}>
                {usagePercent}%
              </span>
            </div>
            <Progress 
              value={usagePercent} 
              className="h-2"
              color={usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-amber-500' : ''} 
            />
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
            <span className={`font-medium ${connections > 15 ? 'text-amber-500' : ''}`}>
              {connections} ενεργές
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDetailedInfo} 
            className="w-full mt-2 flex items-center justify-center text-sm" 
            disabled={isLoading}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {showDetailedInfo ? "Λιγότερες πληροφορίες" : "Περισσότερες πληροφορίες"}
          </Button>
          
          {showDetailedInfo && (
            <div className="pt-2 space-y-3 animate-fade-in border-t mt-2">
              <div className="flex items-center justify-between">
                <span>Δείκτης Απόδοσης:</span>
                <span className={`font-medium ${performanceIndex < 60 ? 'text-red-500' : performanceIndex < 75 ? 'text-amber-500' : 'text-green-600'}`}>
                  {performanceIndex}/100
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Κατάσταση Σύνδεσης:</span>
                <span className="font-medium text-green-600">Ενεργή</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Τύπος Βάσης:</span>
                <span className="font-medium">PostgreSQL</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Έκδοση:</span>
                <span className="font-medium">14.5</span>
              </div>
            </div>
          )}
        </div>
        
        {isLoading && (
          <div className="mt-4 bg-blue-50 text-blue-700 p-2 rounded text-center text-sm animate-pulse">
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
