
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const HomeCallToAction = () => {
  const { isAuthenticated, isTeacher } = useAuth();
  
  return (
    <div className="bg-gradient-to-br from-primary/80 to-primary py-12 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ξεκινήστε το εκπαιδευτικό σας ταξίδι σήμερα!</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Εγγραφείτε τώρα για πρόσβαση σε πλούσιο εκπαιδευτικό υλικό, διαδραστικά τεστ
          και εξατομικευμένη παρακολούθηση προόδου.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Link to="/register-type">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Εγγραφή Τώρα
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  Σύνδεση
                </Button>
              </Link>
            </>
          ) : isTeacher ? (
            <Link to="/add-content">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Προσθήκη Νέου Υλικού
              </Button>
            </Link>
          ) : (
            <Link to="/subject/mathematics">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Ξεκινήστε τη Μάθηση
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCallToAction;
