
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/contexts/AuthContext';
import { LoginRecord } from '@/types/auth';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

const AdminLoginsPage = () => {
  const { loginRecords } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Καταγραφές Συνδέσεων</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Ιστορικό Συνδέσεων Χρηστών</CardTitle>
          </CardHeader>
          <CardContent>
            {loginRecords.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Δεν υπάρχουν καταγεγραμμένες συνδέσεις</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Όνομα Χρήστη</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ρόλος</TableHead>
                    <TableHead>Ημερομηνία & Ώρα</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginRecords
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.userName}</TableCell>
                        <TableCell>{record.email}</TableCell>
                        <TableCell>
                          <span className="capitalize">{record.role}</span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(record.timestamp), 'dd/MM/yyyy HH:mm', { locale: el })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLoginsPage;
