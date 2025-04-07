
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, RefreshCw, Home } from 'lucide-react';
import { QuizQuestion } from '@/lib/subjectsData';
import { Subject } from '@/lib/subjectsData';

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  subject: Subject;
  quizType: string;
  onRetry: () => void;
}

const QuizResults = ({ questions, userAnswers, subject, quizType, onRetry }: QuizResultsProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate score
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  
  const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
  
  // Get feedback based on score
  let feedback = '';
  let feedbackColor = '';
  
  if (scorePercentage >= 90) {
    feedback = 'Εξαιρετικά! Έχετε κατανοήσει πλήρως το υλικό.';
    feedbackColor = 'text-green-600';
  } else if (scorePercentage >= 70) {
    feedback = 'Πολύ καλά! Έχετε καλή κατανόηση του υλικού.';
    feedbackColor = 'text-green-500';
  } else if (scorePercentage >= 50) {
    feedback = 'Καλά! Υπάρχει περιθώριο βελτίωσης.';
    feedbackColor = 'text-yellow-500';
  } else {
    feedback = 'Χρειάζεστε περισσότερη εξάσκηση σε αυτή την ενότητα.';
    feedbackColor = 'text-red-500';
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg overflow-hidden">
        <div className={`${subject.color} py-6 px-8 text-white`}>
          <h2 className="text-2xl font-bold mb-2">Αποτελέσματα {quizType}</h2>
          <p className="text-white/80">{subject.name}</p>
        </div>
        
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-gray-100 flex items-center justify-center">
                  <span className="text-4xl font-bold">{scorePercentage}%</span>
                </div>
                <Progress 
                  value={scorePercentage} 
                  className="w-40 h-8 absolute -bottom-4 left-0 rounded-full" 
                />
              </div>
              
              <p className="mb-2">
                <span className="font-bold">{correctAnswers}</span> σωστές από{' '}
                <span className="font-bold">{questions.length}</span> ερωτήσεις
              </p>
              <p className={`text-lg font-medium ${feedbackColor}`}>{feedback}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Απόκρυψη Λεπτομερειών' : 'Εμφάνιση Λεπτομερειών'}
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              Επανάληψη
            </Button>
          </div>
          
          {showDetails && (
            <div className="space-y-6 mt-8 border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Ανάλυση Απαντήσεων</h3>
              
              {questions.map((question, index) => {
                const isCorrect = userAnswers[index] === question.correctAnswer;
                return (
                  <div 
                    key={question.id} 
                    className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 p-1 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? <Check className="h-4 w-4 text-white" /> : <X className="h-4 w-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium mb-2">Ερώτηση {index + 1}: {question.question}</p>
                        <p className="text-sm mb-2">
                          <span className="font-medium">Η απάντησή σας:</span> {question.options[userAnswers[index]]}
                          {!isCorrect && (
                            <span className="block mt-1">
                              <span className="font-medium">Σωστή απάντηση:</span> {question.options[question.correctAnswer]}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/subject/${subject.id}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              Επιστροφή στο μάθημα
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Αρχική σελίδα
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
