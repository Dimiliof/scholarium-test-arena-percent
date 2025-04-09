
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerifiedBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center gap-3">
        <Check className="h-5 w-5 text-green-500" />
        <p className="text-green-700">
          Έχετε επαληθευτεί ως εκπαιδευτικός και μπορείτε να προσθέσετε υλικό.
        </p>
      </div>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/teacher-dashboard')}
          className="flex items-center gap-2"
        >
          <span>Μετάβαση στον Πίνακα Εκπαιδευτικού</span>
        </Button>
      </div>
    </>
  );
};

export default VerifiedBanner;
