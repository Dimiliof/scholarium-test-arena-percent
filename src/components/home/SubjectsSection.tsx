
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Lock, BookOpen, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import SubjectCard from '@/components/SubjectCard';
import { Subject } from '@/lib/subjectsData';
import { Card, CardContent } from '@/components/ui/card';

interface SubjectsSectionProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const SubjectsSection = ({ subjects, isAuthenticated }: SubjectsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Φιλτραρισμένα μαθήματα βάσει αναζήτησης και επιλεγμένου μαθήματος
  const filteredSubjects = subjects.filter(subject => {
    // Φιλτράρισμα με βάση την αναζήτηση
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Φιλτράρισμα με βάση την επιλογή μαθήματος
    const matchesSelection = selectedSubject === null || selectedSubject === 'all' || subject.id === selectedSubject;
    
    return matchesSearch && matchesSelection;
  });

  // Λίστα των διαθέσιμων μαθημάτων για φιλτράρισμα (βασισμένη στην εικόνα)
  const subjectFilters = [
    { id: 'all', name: 'Όλα τα μαθήματα' },
    { id: 'ancient-greek', name: 'Αρχαία Ελληνική Γλώσσα' },
    { id: 'mathematics', name: 'Μαθηματικά' },
    { id: 'physics', name: 'Φυσική' },
    { id: 'history', name: 'Ιστορία' }
  ];

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };

  const handleSubjectCardClick = (subjectId: string) => {
    if (isAuthenticated) {
      navigate(`/subject/${subjectId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div id="subjects-section" className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Διαθέσιμα Μαθήματα</h2>
      
      {/* Φίλτρα μαθημάτων */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Λίστα με επιλογές μαθημάτων */}
          <div className="w-full md:w-auto space-y-2">
            <h3 className="text-lg font-semibold mb-2 hidden md:block">Μαθήματα</h3>
            <ul className="flex flex-col gap-2">
              {subjectFilters.map((filter) => (
                <li key={filter.id}>
                  <Button 
                    variant={selectedSubject === filter.id || (filter.id === 'all' && selectedSubject === null) ? "default" : "outline"}
                    className="justify-start w-full md:w-auto text-left"
                    onClick={() => handleSubjectClick(filter.id)}
                  >
                    {filter.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Αναζήτηση - Μόνο για συνδεδεμένους χρήστες */}
          {isAuthenticated && (
            <div className="max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Αναζήτηση μαθήματος..."
                  className="pl-10 py-6"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isAuthenticated ? (
        <>
          {/* Εμφάνιση πλήρων καρτών μαθημάτων για συνδεδεμένους χρήστες */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <div key={subject.id} onClick={() => handleSubjectCardClick(subject.id)}>
                <SubjectCard subject={subject} />
              </div>
            ))}
          </div>
          
          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Δεν βρέθηκαν μαθήματα με αυτό το όνομα</p>
              <Button className="mt-4" onClick={() => {
                setSearchTerm('');
                setSelectedSubject(null);
              }}>
                Εμφάνιση όλων των μαθημάτων
              </Button>
            </div>
          )}
        </>
      ) : (
        // Απλή λίστα μαθημάτων για μη συνδεδεμένους χρήστες
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-xl font-medium">Συνδεθείτε για πρόσβαση στο πλήρες υλικό</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Για να αποκτήσετε πλήρη πρόσβαση στο εκπαιδευτικό υλικό, τα διαγωνίσματα και τις 
                προσομοιώσεις, παρακαλούμε συνδεθείτε ή δημιουργήστε ένα λογαριασμό.
              </p>
              <div className="flex gap-4">
                <Link to="/login">
                  <Button variant="outline">Σύνδεση</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary">Εγγραφή</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {filteredSubjects.map((subject) => (
              <div 
                key={subject.id} 
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full ${subject.color} flex items-center justify-center text-white`}>
                    {subject.icon}
                  </div>
                  <h3 className="font-medium">{subject.name}</h3>
                </div>
                <Badge variant="outline" className="bg-gray-100">
                  Απαιτείται σύνδεση
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsSection;
