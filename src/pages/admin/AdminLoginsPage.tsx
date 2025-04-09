import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { LoginRecord } from "@/types/auth";
import { format } from "date-fns";

const AdminLoginsPage = () => {
  const { loginRecords } = useAuth();
  const [formattedLoginRecords, setFormattedLoginRecords] = useState<LoginRecord[]>([]);

  useEffect(() => {
    // Sort login records by timestamp in descending order (most recent first)
    const sortedRecords = [...loginRecords].sort((a, b) => b.timestamp - a.timestamp);
    setFormattedLoginRecords(sortedRecords);
  }, [loginRecords]);

  return (
    <>
      <Helmet>
        <title>Admin - Logins | Εκπαιδευτική Πλατφόρμα</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4">Λίστα Συνδέσεων Χρηστών</h1>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Χρήστη</TableHead>
                <TableHead>Όνομα Χρήστη</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ρόλος</TableHead>
                <TableHead>Ημερομηνία Σύνδεσης</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedLoginRecords.map((record) => (
                <TableRow key={record.userId + record.timestamp}>
                  <TableCell>{record.userId}</TableCell>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell>{record.role}</TableCell>
                  <TableCell>
                    {format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default AdminLoginsPage;
