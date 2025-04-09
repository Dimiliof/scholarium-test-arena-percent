
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { subjects } from '@/lib/subjectsData';

interface SubjectSelectorProps {
  onSelectSubject: (subjectId: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelectSubject }) => {
  return (
    <>
      <p className="text-lg mb-6">Επιλέξτε το μάθημα στο οποίο θέλετε να προσθέσετε υλικό:</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => {
          const IconComponent = subject.icon;
          
          return (
            <Card 
              key={subject.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectSubject(subject.id)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${subject.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl`}>
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-bold">{subject.name}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SubjectSelector;
