
import React from 'react';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/subjectsData';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface SubjectDetailsCardProps {
  subject: Subject;
}

const SubjectDetailsCard: React.FC<SubjectDetailsCardProps> = ({ subject }) => {
  // Default icon if none is provided
  const IconComponent = subject.icon || BookOpen;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        {IconComponent && <IconComponent className={`h-10 w-10 mr-4 ${subject.color.replace('bg-', 'text-')}`} />}
        <h2 className="text-2xl font-bold">{subject.name}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">{subject.description || 'Διαθέσιμο εκπαιδευτικό υλικό και ασκήσεις'}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Διαθέσιμα Τεστ</h3>
          <p className="text-3xl font-bold text-primary">{subject.availableTests || 0}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Εκπαιδευτικό Υλικό</h3>
          <p className="text-3xl font-bold text-primary">{subject.availableMaterials || 0}</p>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <Link to={`/subject/${subject.id}/tests`} className="flex-1">
          <Button variant="outline" className="w-full">
            Προβολή Τεστ
          </Button>
        </Link>
        
        <Link to={`/subject/${subject.id}/materials`} className="flex-1">
          <Button variant="outline" className="w-full">
            Εκπαιδευτικό Υλικό
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubjectDetailsCard;
