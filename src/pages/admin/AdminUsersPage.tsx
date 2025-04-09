
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const AdminUsersPage = () => {
  const { getAllUsers, isAdmin, fixAdminEmail, makeUserTeacherAndAdmin } = useAuth();
  const [isFixEmailDialogOpen, setIsFixEmailDialogOpen] = useState(false);
  const [isTeacherAdminDialogOpen, setIsTeacherAdminDialogOpen] = useState(false);
  const [emailToFix, setEmailToFix] = useState('');
  const [emailToPromote, setEmailToPromote] = useState('');
  
  const users = getAllUsers();
  
  const handleFixAdminEmail = async () => {
    if (!emailToFix.trim()) {
      toast.error("Το email δεν μπορεί να είναι κενό");
      return;
    }
    
    const success = await fixAdminEmail(emailToFix);
    
    if (success) {
      toast.success("Το email του διαχειριστή ενημερώθηκε επιτυχώς");
      setIsFixEmailDialogOpen(false);
      setEmailToFix('');
    } else {
      toast.error("Σφάλμα κατά την ενημέρωση του email");
    }
  };
  
  const handleMakeTeacherAndAdmin = async () => {
    if (!emailToPromote.trim()) {
      toast.error("Το email δεν μπορεί να είναι κενό");
      return;
    }
    
    const success = await makeUserTeacherAndAdmin(emailToPromote);
    
    if (success) {
      toast.success("Ο χρήστης έγινε διαχειριστής και εκπαιδευτικός με επιτυχία");
      setIsTeacherAdminDialogOpen(false);
      setEmailToPromote('');
    } else {
      toast.error("Σφάλμα κατά την αναβάθμιση ρόλων του χρήστη");
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Μη εξουσιοδοτημένη πρόσβαση</h1>
          <p>Δεν έχετε πρόσβαση σε αυτή τη σελίδα.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold">Διαχείριση Χρηστών</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setIsFixEmailDialogOpen(true)}
            >
              Διόρθωση email διαχειριστή
            </Button>
            
            <Button onClick={() => setIsTeacherAdminDialogOpen(true)}>
              Προσθήκη ρόλων διαχειριστή
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Όλοι οι χρήστες</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Δεν υπάρχουν εγγεγραμμένοι χρήστες</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Όνομα</TableHead>
                    <TableHead>Επώνυμο</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ρόλος</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.roles && user.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map(role => (
                              <span 
                                key={role} 
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="capitalize">{user.role}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isFixEmailDialogOpen} onOpenChange={setIsFixEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Διόρθωση email διαχειριστή</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="adminEmail">Email διαχειριστή</Label>
              <Input 
                id="adminEmail" 
                value={emailToFix} 
                onChange={(e) => setEmailToFix(e.target.value)} 
                placeholder="π.χ. admin@example.com"
                autoComplete="off"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFixEmailDialogOpen(false)}>Άκυρο</Button>
              <Button onClick={handleFixAdminEmail}>Ενημέρωση</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isTeacherAdminDialogOpen} onOpenChange={setIsTeacherAdminDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Προσθήκη ρόλων διαχειριστή</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="userEmail">Email χρήστη</Label>
              <Input 
                id="userEmail" 
                value={emailToPromote} 
                onChange={(e) => setEmailToPromote(e.target.value)} 
                placeholder="π.χ. user@example.com"
                autoComplete="off"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Αυτό θα δώσει στον χρήστη τους ρόλους "admin" και "teacher"
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTeacherAdminDialogOpen(false)}>Άκυρο</Button>
              <Button onClick={handleMakeTeacherAndAdmin}>Αναβάθμιση</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
