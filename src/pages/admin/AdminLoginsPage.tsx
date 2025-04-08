
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, LoginRecord } from "@/contexts/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Search, UserX } from "lucide-react";

// Βοηθητική συνάρτηση για τη μορφοποίηση της ημερομηνίας
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('el-GR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Βοηθητική συνάρτηση για το χρονικό διάστημα που πέρασε
const timeAgo = (timestamp: number): string => {
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: el });
};

const AdminLoginsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, loginRecords } = useAuth();
  const [filteredRecords, setFilteredRecords] = useState<LoginRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Έλεγχος αν ο χρήστης είναι διαχειριστής
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Φιλτράρισμα των εγγραφών βάσει των κριτηρίων αναζήτησης
  useEffect(() => {
    let records = [...loginRecords];
    
    // Εφαρμογή φίλτρου ρόλου
    if (roleFilter !== 'all') {
      records = records.filter(record => record.role === roleFilter);
    }
    
    // Εφαρμογή φίλτρου αναζήτησης
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      records = records.filter(record => 
        record.userName.toLowerCase().includes(lowerSearchTerm) || 
        record.email.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredRecords(records);
  }, [loginRecords, searchTerm, roleFilter]);

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
              <Shield className="h-8 w-8" />
              Καταγραφές Συνδέσεων
            </h1>
            <p className="text-muted-foreground">
              Προβολή του ιστορικού συνδέσεων των χρηστών στην πλατφόρμα
            </p>
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
        
        {/* Πίνακας καταγραφών */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>
                {filteredRecords.length === 0 ? 
                  "Δεν βρέθηκαν καταγραφές συνδέσεων" : 
                  `Συνολικά ${filteredRecords.length} καταγραφές συνδέσεων`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Χρήστης</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ρόλος</TableHead>
                  <TableHead>Ημερομηνία</TableHead>
                  <TableHead>Χρονικό διάστημα</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UserX className="h-8 w-8 text-muted-foreground" />
                        <p>Δεν βρέθηκαν καταγραφές συνδέσεων</p>
                        <p className="text-sm text-muted-foreground">
                          Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {record.userName}
                      </TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        {record.role === "admin" ? "Διαχειριστής" :
                         record.role === "teacher" ? "Εκπαιδευτικός" : "Μαθητής"}
                      </TableCell>
                      <TableCell>{formatDate(record.timestamp)}</TableCell>
                      <TableCell>{timeAgo(record.timestamp)}</TableCell>
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

export default AdminLoginsPage;
