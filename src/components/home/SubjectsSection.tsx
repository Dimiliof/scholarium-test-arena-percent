
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Book, 
  FlaskConical, 
  ScrollText, 
  Landmark, 
  Code 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subject } from '@/lib/subjectsData';

// Updated the list to use FlaskConical instead of Flask
const subjectsList = [
  { 
    id: 'all', 
    name: 'Όλα τα μαθήματα', 
    icon: BookOpen, 
    color: 'bg-blue-500' 
  },
  { 
    id: 'ancient-greek', 
    name: 'Αρχαία Ελληνική Γλώσσα', 
    icon: ScrollText, 
    color: 'bg-purple-500' 
  },
  { 
    id: 'mathematics', 
    name: 'Μαθηματικά', 
    icon: Book, 
    color: 'bg-green-500' 
  },
  { 
    id: 'physics', 
    name: 'Φυσική', 
    icon: FlaskConical, 
    color: 'bg-red-500' 
  },
  { 
    id: 'history', 
    name: 'Ιστορία', 
    icon: Landmark, 
    color: 'bg-orange-500' 
  },
  { 
    id: 'computer_science', 
    name: 'Πληροφορική', 
    icon: Code, 
    color: 'bg-indigo-500' 
  }
];

interface SubjectsSectionProps {
  subjects?: Subject[];
  isAuthenticated?: boolean;
}

const SubjectsSection: React.FC<SubjectsSectionProps> = ({ subjects, isAuthenticated }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Επιλέξτε Μάθημα
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjectsList.map((subject) => (
          <Button
            key={subject.id}
            variant="outline"
            className={cn(
              "w-full flex flex-col items-center justify-center space-y-2 h-32 transition-all duration-300",
              subject.id === 'all' 
                ? "bg-blue-500 text-white hover:bg-blue-600 border-0"
                : selectedSubject === subject.id 
                  ? `${subject.color} text-white hover:opacity-90` 
                  : "bg-white border hover:border-primary"
            )}
            onClick={() => setSelectedSubject(subject.id)}
          >
            {subject.id === 'all' ? (
              <div className="flex flex-col items-center justify-center">
                <subject.icon className="h-8 w-8 mb-4 text-white" />
                <span className="text-lg font-medium text-center text-white">
                  {subject.name}
                </span>
              </div>
            ) : (
              <>
                <subject.icon 
                  className={cn(
                    "h-7 w-7", 
                    selectedSubject === subject.id ? "text-white" : subject.color
                  )} 
                />
                <span className="text-sm font-medium text-center">
                  {subject.name}
                </span>
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SubjectsSection;
