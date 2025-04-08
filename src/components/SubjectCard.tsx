
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Subject } from '@/lib/subjectsData';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  // Δυναμική εύρεση του κατάλληλου εικονιδίου
  const IconComponent = LucideIcons[subject.icon as keyof typeof LucideIcons] as LucideIcon || 
    (() => <span className="text-white text-xl">?</span>);

  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="card-hover h-full flex flex-col">
        <CardContent className="flex flex-col items-center pt-6 pb-4 flex-grow">
          <div className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center text-white mb-4`}>
            <IconComponent className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg text-center mb-2">{subject.name}</h3>
          <p className="text-gray-600 text-sm text-center">{subject.description}</p>
        </CardContent>
        <CardFooter className="border-t p-4 justify-center">
          <span className="text-primary text-sm font-medium">Προβολή</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SubjectCard;
