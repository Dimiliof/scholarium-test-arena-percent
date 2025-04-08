
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, BookOpen, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UsersTabProps = {
  onAction: (action: string) => void;
};

const UsersTab = ({ onAction }: UsersTabProps) => {
  const { fixAdminEmail, makeUserTeacherAndAdmin, getAllUsers } = useAuth();
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    roles?: string[];
    lastActivity: number;
  }>>([]);

  // Προσομοίωση φόρτωσης συνδεδεμένων χρηστών
  useEffect(() => {
    const loadActiveUsers = () => {
      // Σε πραγματική εφαρμογή, θα φέρναμε αυτά τα δεδομένα από το server
      // Για την προσομοίωση χρησιμοποιούμε τη λίστα χρηστών και προσθέτουμε χρόνο τελευταίας δραστηριότητας
      const allUsers = getAllUsers();
      
      // Φιλτράρουμε μόνο τους μαθητές και δημιουργούμε προσομοιωμένα δεδομένα δραστηριότητας
      const students = allUsers
        .filter((user: any) => 
          user.role === "student" || 
          (user.roles && user.roles.includes("student"))
        )
        .map((user: any) => ({
          ...user,
          lastActivity: Date.now() - Math.floor(Math.random() * 3600000) // Τυχαία χρονική στιγμή την τελευταία ώρα
        }));
      
      // Προσθέτουμε και μερικούς από τους εκπαιδευτικούς/διαχειριστές για ποικιλία
      const others = allUsers
        .filter((user: any) => 
          user.role !== "student" && 
          (!user.roles || !user.roles.includes("student"))
        )
        .slice(0, 2) // Παίρνουμε μόνο τους πρώτους 2
        .map((user: any) => ({
          ...user,
          lastActivity: Date.now() - Math.floor(Math.random() * 1800000) // Τυχαία χρονική στιγμή το τελευταίο μισάωρο
        }));
      
      setActiveUsers([...students, ...others]);
    };
    
    loadActiveUsers();
    
    // Ανανέωση κάθε 30 δευτερόλεπτα για προσομοίωση πραγματικού χρόνου
    const interval = setInterval(() => {
      loadActiveUsers();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [getAllUsers]);

  const handleFixAdmin = async () => {
    setIsLoading(true);
    const adminEmail = "liofisdimitris@gmail.com";
    const success = await makeUserTeacherAndAdmin(adminEmail);
    
    if (success) {
      uiToast({
        title: "Επιτυχής ενημέρωση",
        description: `Ο χρήστης ${adminEmail} ορίστηκε ως διαχειριστής και εκπαιδευτικός επιτυχώς.`,
      });
      
      toast.success("Ορισμός διπλού ρόλου επιτυχής!", {
        position: "top-center",
      });
      
      onAction("Όρισμός διπλού ρόλου");
    } else {
      uiToast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Προέκυψε πρόβλημα κατά την ενημέρωση του ρόλου.",
      });
    }
    setIsLoading(false);
  };

  // Βοηθητική συνάρτηση για μορφοποίηση του χρόνου τελευταίας δραστηριότητας
  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // Λιγότερο από 1 λεπτό
      return "Μόλις τώρα";
    } else if (diff < 3600000) { // Λιγότερο από 1 ώρα
      return `${Math.floor(diff / 60000)} λεπτά πριν`;
    } else {
      return `${Math.floor(diff / 3600000)} ώρες πριν`;
    }
  };

  // Συνάρτηση για το χρώμα της κατάστασης ενεργού χρήστη
  const getStatusColor = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 300000) { // Λιγότερο από 5 λεπτά - ενεργός
      return "bg-green-500";
    } else if (diff < 1800000) { // Λιγότερο από 30 λεπτά - σε αδράνεια
      return "bg-yellow-500";
    } else { // Περισσότερο από 30 λεπτά - ανενεργός
      return "bg-gray-500";
    }
  };

  // Συνάρτηση για το κείμενο της κατάστασης χρήστη
  const getStatusText = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 300000) { // Λιγότερο από 5 λεπτά
      return "Ενεργός";
    } else if (diff < 1800000) { // Λιγότερο από 30 λεπτά
      return "Σε αδράνεια";
    } else { // Περισσότερο από 30 λεπτά
      return "Ανενεργός";
    }
  };

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
        
        {/* Κουμπιά ενεργειών */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          <Button 
            className="w-full"
            onClick={() => onAction("Προβολή λίστας χρηστών")}
          >
            <Users className="h-4 w-4 mr-2" />
            Προβολή Όλων των Χρηστών
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onAction("Έλεγχος δικαιωμάτων")}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Έλεγχος Δικαιωμάτων
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            onClick={handleFixAdmin}
            disabled={isLoading}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            <BookOpen className="h-4 w-4 mr-2" />
            {isLoading ? "Ορισμός..." : "Όρισε Διαχειριστή & Εκπαιδευτικό"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onAction("Ανανέωση δεδομένων χρηστών")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Ανανέωση Δεδομένων
          </Button>
        </div>
        
        {/* Ενότητα συνδεδεμένων χρηστών */}
        <div className="bg-muted p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-500" />
            Συνδεδεμένοι Χρήστες
          </h3>
          
          <div className="space-y-4 max-h-80 overflow-y-auto p-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${user.firstName} ${user.lastName}`
                        )}&background=random`} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(user.lastActivity)} border-2 border-white`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    user.role === "admin" || (user.roles && user.roles.includes("admin")) 
                      ? "destructive" 
                      : user.role === "teacher" || (user.roles && user.roles.includes("teacher")) 
                      ? "default" 
                      : "secondary"
                  }>
                    {user.role === "admin" || (user.roles && user.roles.includes("admin")) 
                      ? "Διαχειριστής" 
                      : user.role === "teacher" || (user.roles && user.roles.includes("teacher")) 
                      ? "Εκπαιδευτικός" 
                      : "Μαθητής"}
                  </Badge>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {getStatusText(user.lastActivity)} · {formatLastActive(user.lastActivity)}
                  </div>
                </div>
              </div>
            ))}
            
            {activeUsers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Δεν υπάρχουν συνδεδεμένοι χρήστες αυτή τη στιγμή
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
