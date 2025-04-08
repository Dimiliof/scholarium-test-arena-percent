
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects } from '@/lib/subjectsData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SubjectDetailsCard from '@/components/SubjectDetailsCard';
import { Link } from 'react-router-dom';

// Ορισμός του interface EnhancedSubject
interface EnhancedSubject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  availableTests?: number;
  availableMaterials?: number;
  teacherName: string;
  isEnrolled: boolean;
}

const StudentEnrollPage = () => {
  // Συνάρτηση για τυχαία επιλογή καθηγητή
  const getRandomTeacher = () => {
    const teachers = [
      'Δρ. Παπαδόπουλος Γιώργος',
      'Δρ. Αθανασίου Μαρία',
      'Δρ. Δημητρίου Ελένη',
      'Καθ. Κωνσταντίνου Νίκος',
      'Καθ. Βασιλείου Άννα'
    ];
    return teachers[Math.floor(Math.random() * teachers.length)];
  };

  // Και στην αρχικοποίηση της μεταβλητής subjectsWithEnrollment
  const subjectsWithEnrollment: EnhancedSubject[] = subjects.map(subject => ({
    ...subject,
    description: subject.description || 'Δεν υπάρχει διαθέσιμη περιγραφή',
    teacherName: getRandomTeacher(),
    isEnrolled: Math.random() > 0.5 // Τυχαία εγγραφή για demo
  }));

  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);

  const handleEnroll = (subjectId: string) => {
    setEnrolledSubjects(prev => {
      if (prev.includes(subjectId)) {
        toast.error('Είστε ήδη εγγεγραμμένοι σε αυτό το μάθημα');
        return prev;
      }
      
      toast.success('Επιτυχής εγγραφή στο μάθημα!');
      return [...prev, subjectId];
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Εγγραφή σε Μαθήματα</h1>
              <p className="text-muted-foreground">Εξερευνήστε τα διαθέσιμα μαθήματα και εγγραφείτε σε αυτά που σας ενδιαφέρουν</p>
            </div>
            
            <Link to="/student/courses">
              <Button variant="outline" className="mt-4 md:mt-0">
                Τα μαθήματά μου
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectsWithEnrollment.map(subject => (
              <Card key={subject.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <SubjectDetailsCard subject={subject} />
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full" 
                      variant={enrolledSubjects.includes(subject.id) ? "outline" : "default"}
                      onClick={() => handleEnroll(subject.id)}
                    >
                      {enrolledSubjects.includes(subject.id) ? 'Εγγεγραμμένοι' : 'Εγγραφή'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentEnrollPage;
