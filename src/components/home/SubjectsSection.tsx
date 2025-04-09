
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Book, 
  FlaskConical, 
  ScrollText, 
  Landmark, 
  Code,
  Music,
  Heart,
  Globe,
  Calculator,
  Dna,
  Lightbulb,
  BookText,
  Building,
  Infinity,
  PenTool,
  Palette,
  ActivitySquare,
  School,
  FileText,
  Table,
  BarChart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subject } from '@/lib/subjectsData';

const subjectsList = [
  { 
    id: 'all', 
    name: 'Όλα τα μαθήματα', 
    icon: BookOpen, 
    color: 'bg-blue-500' 
  },
  { 
    id: 'ancient-greek-language', 
    name: 'Αρχαία Ελληνική Γλώσσα', 
    icon: ScrollText, 
    color: 'bg-purple-500' 
  },
  { 
    id: 'ancient-greek-literature', 
    name: 'Αρχαία Ελληνική Γραμματεία', 
    icon: BookText, 
    color: 'bg-purple-700' 
  },
  { 
    id: 'modern-greek-language', 
    name: 'Νεοελληνική Γλώσσα', 
    icon: PenTool, 
    color: 'bg-indigo-500' 
  },
  { 
    id: 'modern-greek-literature', 
    name: 'Νεοελληνική Γραμματεία', 
    icon: Book, 
    color: 'bg-indigo-700' 
  },
  { 
    id: 'history', 
    name: 'Ιστορία', 
    icon: Landmark, 
    color: 'bg-amber-600' 
  },
  { 
    id: 'religious-studies', 
    name: 'Θρησκευτικά', 
    icon: Building, 
    color: 'bg-blue-600' 
  },
  { 
    id: 'civics', 
    name: 'ΚΠΑ', 
    icon: School, 
    color: 'bg-green-600' 
  },
  { 
    id: 'mathematics', 
    name: 'Μαθηματικά', 
    icon: Calculator, 
    color: 'bg-green-500' 
  },
  { 
    id: 'chemistry', 
    name: 'Χημεία', 
    icon: FlaskConical, 
    color: 'bg-pink-500' 
  },
  { 
    id: 'physics', 
    name: 'Φυσική', 
    icon: Infinity, 
    color: 'bg-red-500' 
  },
  { 
    id: 'biology', 
    name: 'Βιολογία', 
    icon: Dna, 
    color: 'bg-emerald-500' 
  },
  { 
    id: 'word', 
    name: 'Microsoft Word', 
    icon: FileText, 
    color: 'bg-blue-600' 
  },
  { 
    id: 'excel', 
    name: 'Microsoft Excel', 
    icon: Table, 
    color: 'bg-green-600' 
  },
  { 
    id: 'powerpoint', 
    name: 'Microsoft PowerPoint', 
    icon: BarChart, 
    color: 'bg-orange-600' 
  },
  { 
    id: 'technology', 
    name: 'Τεχνολογία', 
    icon: Code, 
    color: 'bg-slate-700' 
  },
  { 
    id: 'music', 
    name: 'Μουσική', 
    icon: Music, 
    color: 'bg-violet-500' 
  },
  { 
    id: 'emotional-education', 
    name: 'Συναισθηματική Αγωγή', 
    icon: Heart, 
    color: 'bg-red-400' 
  },
  { 
    id: 'geography', 
    name: 'Γεωγραφία', 
    icon: Globe, 
    color: 'bg-cyan-500' 
  },
  { 
    id: 'art', 
    name: 'Καλλιτεχνικά', 
    icon: Palette, 
    color: 'bg-orange-500' 
  },
  { 
    id: 'physical-education', 
    name: 'Φυσική Αγωγή', 
    icon: ActivitySquare, 
    color: 'bg-yellow-500' 
  },
  { 
    id: 'computer-science', 
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

  const navigateToSubject = (subjectId: string) => {
    if (subjectId === 'all') {
      // When 'all' is selected, just update the state
      setSelectedSubject(subjectId);
    } else {
      // For specific subjects, update state and allow the Link to navigate
      setSelectedSubject(subjectId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Επιλέξτε Μάθημα
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {subjectsList.map((subject) => (
          <Link 
            key={subject.id}
            to={subject.id === 'all' ? '/' : `/subject/${subject.id}`}
            className="w-full"
            onClick={(e) => {
              if (subject.id === 'all') {
                e.preventDefault();
                navigateToSubject(subject.id);
              } else {
                navigateToSubject(subject.id);
              }
            }}
          >
            <Button
              variant="outline"
              className={cn(
                "w-full flex flex-col items-center justify-center space-y-2 h-32 transition-all duration-300",
                subject.id === 'all' 
                  ? "bg-blue-500 text-white hover:bg-blue-600 border-0"
                  : selectedSubject === subject.id 
                    ? `${subject.color} text-white hover:opacity-90` 
                    : "bg-white border hover:border-primary"
              )}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectsSection;
