
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import SubjectCard from '@/components/SubjectCard';
import { Subject } from '@/lib/subjectsData';

interface SubjectsSectionProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const SubjectsSection = ({ subjects, isAuthenticated }: SubjectsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="subjects-section" className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Διαθέσιμα Μαθήματα</h2>
      
      {isAuthenticated ? (
        // Εμφάνιση πλήρων καρτών μαθημάτων για συνδεδεμένους χρήστες
        <>
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12 relative">
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
          
          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
          
          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Δεν βρέθηκαν μαθήματα με αυτό το όνομα</p>
              <Button className="mt-4" onClick={() => setSearchTerm('')}>
                Εμφάνιση όλων των μαθημάτων
              </Button>
            </div>
          )}
        </>
      ) : (
        // Απλή λίστα μαθημάτων για μη συνδεδεμένους χρήστες
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
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
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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
