import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Wrench } from 'lucide-react';

const RegisterSelectionPage = () => {
  const navigate = useNavigate();

  const handleITSupportLogin = () => {
    navigate("/it-support-login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Επιλέξτε τύπο εγγραφής</h1>
            <p className="text-muted-foreground">
              Επιλέξτε τον τύπο λογαριασμού που θέλετε να δημιουργήσετε
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/register" className="block">
              <Card className="h-full transition-all border-2 hover:border-green-500 hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-4 rounded-full">
                      <GraduationCap className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl">Μαθητής</CardTitle>
                  <CardDescription className="text-center">
                    Εγγραφείτε ως μαθητής για πρόσβαση στο εκπαιδευτικό υλικό
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">✓</span> 
                      Πρόσβαση σε όλο το εκπαιδευτικό υλικό
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">✓</span> 
                      Διαγωνίσματα και ασκήσεις
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">✓</span> 
                      Παρακολούθηση προόδου
                    </li>
                  </ul>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Εγγραφή ως Μαθητής
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/teacher-register" className="block">
              <Card className="h-full transition-all border-2 hover:border-blue-500 hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <BookOpen className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl">Εκπαιδευτικός</CardTitle>
                  <CardDescription className="text-center">
                    Εγγραφείτε ως εκπαιδευτικός για να μπορείτε να προσθέσετε υλικό
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-blue-100 p-1 rounded-full mr-2">✓</span> 
                      Όλα τα προνόμια των μαθητών
                    </li>
                    <li className="flex items-center">
                      <span className="bg-blue-100 p-1 rounded-full mr-2">✓</span> 
                      Δημιουργία ασκήσεων και διαγωνισμάτων
                    </li>
                    <li className="flex items-center">
                      <span className="bg-blue-100 p-1 rounded-full mr-2">✓</span> 
                      Πρόσβαση στον πίνακα εκπαιδευτικού
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Εγγραφή ως Εκπαιδευτικός
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-8 flex justify-center items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Έχετε ήδη λογαριασμό;{" "}
              <Link to="/login" className="text-primary hover:underline">
                Συνδεθείτε εδώ
              </Link>
            </p>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleITSupportLogin}
            >
              <Wrench className="h-4 w-4" />
              Σύνδεση IT Support
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterSelectionPage;
