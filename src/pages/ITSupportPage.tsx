
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Users, FileText, Database, Server, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ITSupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Έλεγχος αν ο χρήστης είναι διαχειριστής
    if (!isAuthenticated || !isAdmin) {
      toast({
        variant: "destructive",
        title: "Πρόσβαση απορρίφθηκε",
        description: "Δεν έχετε δικαίωμα πρόσβασης σε αυτή τη σελίδα.",
      });
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Προσομοίωση ενεργειών διαχείρισης
  const handleSystemAction = (action: string) => {
    toast({
      title: "Ενέργεια IT Support",
      description: `Η ενέργεια "${action}" εκτελέστηκε επιτυχώς.`,
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Δεν εμφανίζουμε περιεχόμενο αν ο χρήστης δεν είναι διαχειριστής
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Server className="h-8 w-8 mr-2 text-primary" />
          Πίνακας Ελέγχου IT Support
        </h1>
        
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="system">Σύστημα</TabsTrigger>
            <TabsTrigger value="users">Χρήστες</TabsTrigger>
            <TabsTrigger value="logs">Καταγραφές</TabsTrigger>
            <TabsTrigger value="security">Ασφάλεια</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => handleSystemAction("Επανεκκίνηση υπηρεσιών")}
                  >
                    Επανεκκίνηση Υπηρεσιών
                  </Button>
                </CardFooter>
              </Card>
              
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
                    onClick={() => handleSystemAction("Δημιουργία backup")}
                  >
                    Backup
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSystemAction("Βελτιστοποίηση βάσης")}
                  >
                    Optimize
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Παρακολούθηση
                  </CardTitle>
                  <CardDescription>Παρακολούθηση απόδοσης συστήματος</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span>CPU Load:</span>
                    <span className="font-medium">22%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Disk Space:</span>
                    <span className="font-medium">48% used</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Network:</span>
                    <span className="font-medium">3.2 Mbps</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleSystemAction("Λήψη αναλυτικής αναφοράς")}
                  >
                    Αναλυτική Αναφορά
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
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
                  onClick={() => handleSystemAction("Προβολή λίστας χρηστών")}
                >
                  Προβολή Όλων των Χρηστών
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSystemAction("Έλεγχος δικαιωμάτων")}
                >
                  Έλεγχος Δικαιωμάτων
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
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
                  onClick={() => handleSystemAction("Προβολή καταγραφών συστήματος")}
                >
                  Προβολή Καταγραφών
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSystemAction("Λήψη αναφοράς καταγραφών")}
                >
                  Εξαγωγή Αναφοράς
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
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
                  onClick={() => handleSystemAction("Έλεγχος ασφαλείας")}
                >
                  Έλεγχος Ασφαλείας
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSystemAction("Ενημέρωση ρυθμίσεων firewall")}
                >
                  Ρυθμίσεις Firewall
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ITSupportPage;
