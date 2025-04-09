
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginRecord } from "@/types/auth";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLoginsPage = () => {
  const { loginRecords } = useAuth();
  const [formattedLoginRecords, setFormattedLoginRecords] = useState<LoginRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<LoginRecord[]>([]);

  useEffect(() => {
    // Sort login records by timestamp in descending order (most recent first)
    const sortedRecords = [...loginRecords].sort((a, b) => b.timestamp - a.timestamp);
    setFormattedLoginRecords(sortedRecords);
    setFilteredRecords(sortedRecords);
  }, [loginRecords]);

  // Filter records based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecords(formattedLoginRecords);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = formattedLoginRecords.filter(record => 
      record.userName.toLowerCase().includes(lowercaseSearch) ||
      record.email.toLowerCase().includes(lowercaseSearch) ||
      record.role.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredRecords(filtered);
  }, [searchTerm, formattedLoginRecords]);

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    if (role === "admin") return "destructive";
    if (role === "teacher") return "default";
    return "secondary";
  };

  // Format time elapsed 
  const getTimeElapsed = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return "Μόλις τώρα";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} λεπτά πριν`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ώρες πριν`;
    return `${Math.floor(diff / 86400000)} ημέρες πριν`;
  };

  return (
    <>
      <Helmet>
        <title>Admin - Logins | Εκπαιδευτική Πλατφόρμα</title>
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserCheck className="h-6 w-6 mr-2 text-primary" />
              Λίστα Συνδέσεων Χρηστών
            </CardTitle>
            <CardDescription>
              Παρακολούθηση όλων των συνδέσεων χρηστών στην πλατφόρμα
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Αναζήτηση με όνομα, email ή ρόλο..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Καθαρισμός
              </Button>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Χρήστης</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[120px]">Ρόλος</TableHead>
                    <TableHead className="w-[160px]">Ημερομηνία</TableHead>
                    <TableHead className="w-[120px]">Ώρα</TableHead>
                    <TableHead className="w-[100px] text-right">Πριν από</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={`${record.userId}-${record.timestamp}`}>
                        <TableCell className="font-medium">{record.userName}</TableCell>
                        <TableCell>{record.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeColor(record.role)}>
                            {record.role === "admin" ? "Διαχειριστής" : 
                             record.role === "teacher" ? "Εκπαιδευτικός" : "Μαθητής"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(record.timestamp), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(record.timestamp), "HH:mm:ss")}
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">
                            {getTimeElapsed(record.timestamp)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {searchTerm ? (
                          <div className="text-muted-foreground">
                            Δεν βρέθηκαν εγγραφές που να ταιριάζουν με την αναζήτηση
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            Δεν υπάρχουν καταγραφές συνδέσεων
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground flex items-center">
              <UserCheck className="h-4 w-4 mr-1" />
              Συνολικά {filteredRecords.length} καταγεγραμμένες συνδέσεις
              {searchTerm && ` (φιλτραρισμένες από ${formattedLoginRecords.length})`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </>
  );
};

export default AdminLoginsPage;
