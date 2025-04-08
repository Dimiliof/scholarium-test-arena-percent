
import React from 'react';
import SubjectsSection from '@/components/home/SubjectsSection';
import { Subject } from '@/lib/subjectsData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, AlertCircle } from 'lucide-react';

interface HomeSubjectsGridProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const HomeSubjectsGrid = ({ subjects, isAuthenticated }: HomeSubjectsGridProps) => {
  const { isTeacher, isAdmin } = useAuth();
  
  // Εμφάνιση των μαθημάτων μόνο για εκπαιδευτικούς και διαχειριστές
  if (isAuthenticated && !isTeacher && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-amber-200 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-amber-800 mb-2">
                  Περιορισμένη Πρόσβαση
                </h3>
                <p className="text-amber-700 mb-4">
                  Ως μαθητής έχετε πρόσβαση μόνο στα εργαλεία της πλατφόρμας. Μπορείτε να χρησιμοποιήσετε τον υπολογιστή, τον μετατροπέα και άλλα βοηθητικά εργαλεία.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/tools/calculator">
                    <Button variant="outline" className="bg-white">
                      <Wrench className="h-4 w-4 mr-2" />
                      Υπολογιστής
                    </Button>
                  </Link>
                  <Link to="/tools/converter">
                    <Button variant="outline" className="bg-white">
                      <Wrench className="h-4 w-4 mr-2" />
                      Μετατροπέας
                    </Button>
                  </Link>
                  <Link to="/tools/periodic-table">
                    <Button variant="outline" className="bg-white">
                      <Wrench className="h-4 w-4 mr-2" />
                      Περιοδικός Πίνακας
                    </Button>
                  </Link>
                  <Link to="/tools/formulas">
                    <Button variant="outline" className="bg-white">
                      <Wrench className="h-4 w-4 mr-2" />
                      Συλλογή Τύπων
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Περνάμε το isAuthenticated στο SubjectsSection για να ελέγξουμε τι θα εμφανίσουμε
  return <SubjectsSection subjects={subjects} isAuthenticated={isAuthenticated} />;
};

export default HomeSubjectsGrid;
