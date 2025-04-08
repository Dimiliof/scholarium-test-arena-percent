
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Ανακατεύθυνση αν ο χρήστης δεν είναι συνδεδεμένος
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Το Προφίλ Μου</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    {user.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={user.firstName} />
                    ) : (
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  
                  <div className="w-full mt-6">
                    <Link to="/edit-profile">
                      <Button variant="outline" className="w-full mb-2">
                        Επεξεργασία Προφίλ
                      </Button>
                    </Link>
                    <Link to="/change-password">
                      <Button variant="outline" className="w-full">
                        Αλλαγή Κωδικού
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Στατιστικά Στοιχεία</CardTitle>
                  <CardDescription>
                    Η πρόοδός σας στην πλατφόρμα
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Ολοκληρωμένα Τεστ</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Σωστές Απαντήσεις</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">0%</p>
                      <p className="text-sm text-muted-foreground">Ποσοστό Επιτυχίας</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Πρόσφατη Δραστηριότητα</CardTitle>
                  <CardDescription>
                    Οι τελευταίες σας ενέργειες στην πλατφόρμα
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Δεν υπάρχει πρόσφατη δραστηριότητα.</p>
                    <p>Δοκιμάστε να ολοκληρώσετε μερικά τεστ για να δείτε την πρόοδό σας εδώ.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
