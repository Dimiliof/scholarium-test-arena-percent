
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, User } from "@/contexts/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, UserX, ShieldCheck } from "lucide-react";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, getAllUsers, fixAdminEmail } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Έλεγχος αν ο χρήστης είναι διαχειριστής
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    } else {
      // Φόρτωση των χρηστών
      loadUsers();
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  // Φιλτράρισμα των χρηστών βάσει των κριτηρίων αναζήτησης
  useEffect(() => {
    let filteredList = [...users];
    
    // Εφαρμογή φίλτρου ρόλου
    if (roleFilter !== 'all') {
      filteredList = filteredList.filter(user => user.role === roleFilter);
    }
    
    // Εφαρμογή φίλτρου αναζήτησης
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredList = filteredList.filter(user => 
        user.firstName.toLowerCase().includes(lowerSearchTerm) || 
        user.lastName.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredUsers(filteredList);
  }, [users, searchTerm, roleFilter]);

  // Διόρθωση του ρόλου του διαχειριστή
  const handleFixAdminRole = async () => {
    setIsLoading(true);
    const adminEmail = "liofisdimitris@gmail.com";
    const success = await fixAdminEmail(adminEmail);
    
    if (success) {
      uiToast({
        title: "Επιτυχής ενημέρωση",
        description: `Ο χρήστης ${adminEmail} ορίστηκε ως διαχειριστής επιτυχώς.`,
      });
      
      toast.success("Ο διαχειριστής ορίστηκε επιτυχώς!", {
        position: "top-center",
      });
      
      loadUsers(); // Επαναφόρτωση χρηστών για να εμφανιστούν οι αλλαγές
    } else {
      uiToast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Προέκυψε πρόβλημα κατά την ενημέρωση του ρόλου.",
      });
    }
    setIsLoading(false);
  };

  // Αν ο χρήστης δεν είναι διαχειριστής, δεν εμφανίζουμε τίποτα
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Διαχείριση Χρηστών
            </h1>
            <p className="text-muted-foreground">
              Προβολή και διαχείριση των χρηστών της πλατφόρμας
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={handleFixAdminRole}
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4" />
              {isLoading ? "Ορισμός..." : "Όρισε Διαχειριστή"}
            </Button>
          </div>
        </div>
        
        {/* Φίλτρα αναζήτησης */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Φίλτρα Αναζήτησης</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Αναζήτηση με όνομα ή email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Όλοι οι ρόλοι" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλοι οι ρόλοι</SelectItem>
                    <SelectItem value="admin">Διαχειριστές</SelectItem>
                    <SelectItem value="teacher">Εκπαιδευτικοί</SelectItem>
                    <SelectItem value="student">Μαθητές</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Πίνακας χρηστών */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>
                {filteredUsers.length === 0 ? 
                  "Δεν βρέθηκαν χρήστες" : 
                  `Συνολικά ${filteredUsers.length} χρήστες`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Όνομα</TableHead>
                  <TableHead>Επώνυμο</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ρόλος</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UserX className="h-8 w-8 text-muted-foreground" />
                        <p>Δεν βρέθηκαν χρήστες</p>
                        <p className="text-sm text-muted-foreground">
                          Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName}
                      </TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.role === "admin" ? "destructive" : 
                            user.role === "teacher" ? "default" : "outline"
                          }
                        >
                          {user.role === "admin" ? "Διαχειριστής" :
                           user.role === "teacher" ? "Εκπαιδευτικός" : "Μαθητής"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
