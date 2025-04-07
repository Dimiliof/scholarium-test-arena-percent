
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects } from '@/lib/subjectsData';
import { useAddQuestion } from '@/hooks/useAddQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddQuestionForm } from '@/components/AddQuestionForm';
import { useToast } from '@/hooks/use-toast';

const AddContentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { addQuestion, isAdding } = useAddQuestion();
  
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };
  
  const handleBack = () => {
    setSelectedSubject(null);
  };
  
  const handleQuestionAdded = () => {
    toast({
      title: "Επιτυχής προσθήκη!",
      description: "Η ερώτηση προστέθηκε επιτυχώς στο σύστημα.",
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Προσθήκη Υλικού</h1>
        
        {!selectedSubject ? (
          <>
            <p className="text-lg mb-6">Επιλέξτε το μάθημα στο οποίο θέλετε να προσθέσετε υλικό:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSubjectSelect(subject.id)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`${subject.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl`}>
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{subject.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div>
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mb-6"
            >
              &larr; Πίσω στα μαθήματα
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {subjects.find(s => s.id === selectedSubject)?.name} - Προσθήκη Νέας Ερώτησης
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuestionForm 
                  subjectId={selectedSubject}
                  onSuccess={handleQuestionAdded}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AddContentPage;
