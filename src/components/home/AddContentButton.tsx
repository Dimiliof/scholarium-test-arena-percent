
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AddContentButton = () => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  
  // Εμφάνιση του κουμπιού μόνο για εκπαιδευτικούς και διαχειριστές
  if (!isAuthenticated || (!isTeacher && !isAdmin)) {
    return null;
  }
  
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <Link to="/add-content">
        <Button className="flex items-center gap-2 rounded-full px-6 py-6 shadow-lg bg-primary hover:bg-primary/90">
          <PlusCircle className="h-6 w-6" />
          <span className="font-medium">Προσθήκη Υλικού</span>
        </Button>
      </Link>
    </div>
  );
};

export default AddContentButton;
