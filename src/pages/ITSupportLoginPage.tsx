
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Wrench } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ITSupportLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        // Ελέγχουμε αν ο χρήστης είναι διαχειριστής
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (user.role === "admin") {
          navigate("/it-support");
          toast({
            title: "Επιτυχής σύνδεση",
            description: "Καλωσήρθατε στο IT Support.",
          });
        } else {
          // Αποσύνδεση μη διαχειριστών
          localStorage.removeItem("user");
          toast({
            variant: "destructive",
            title: "Πρόσβαση απορρίφθηκε",
            description: "Μόνο οι διαχειριστές έχουν πρόσβαση στο IT Support.",
          });
          navigate("/");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Αποτυχία σύνδεσης",
          description: "Τα στοιχεία που εισάγατε δεν είναι έγκυρα.",
        });
      }
    } catch (error) {
      console.error("Σφάλμα σύνδεσης:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα σύνδεσης",
        description: "Παρουσιάστηκε σφάλμα κατά τη σύνδεση. Παρακαλώ προσπαθήστε ξανά.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Wrench className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">IT Support Login</CardTitle>
            <CardDescription className="text-center">
              Συνδεθείτε για να αποκτήσετε πρόσβαση στις λειτουργίες IT Support.
              <div className="mt-1 text-red-500 font-medium">
                Μόνο για διαχειριστές του συστήματος.
              </div>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="διαχειριστής@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Κωδικός</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Σύνδεση..." : "Σύνδεση"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ITSupportLoginPage;
