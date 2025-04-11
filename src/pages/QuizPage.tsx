
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects, QuizQuestion } from '@/lib/subjectsData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio } from '@/components/ui/radio';
import { usePrintQuiz } from '@/hooks/usePrintQuiz';
import { usePrintResults } from '@/hooks/usePrintResults';
import QuizResults from '@/components/QuizResults';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';
import { toast } from 'sonner';
import { ArrowLeft, Printer, Download, Share } from 'lucide-react';

function QuizPage() {
  const { subjectId, quizType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { printQuiz } = usePrintQuiz();
  const { printResults } = usePrintResults();
  const { isAuthenticated, user } = useAuth();
  const { getQuestions, saveQuizResult } = useQuestionManagement();
  
  // Παίρνουμε τις παραμέτρους από το URL
  const queryParams = new URLSearchParams(location.search);
  const isPreview = queryParams.get('preview') === 'true';
  const specificQuestionId = queryParams.get('questionId');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId || !quizType) return;

    setLoading(true);
    
    try {
      // Φορτώνουμε τις ερωτήσεις από το localStorage
      let loadedQuestions = getQuestions(subjectId, quizType as any);
      
      // Αν είμαστε σε λειτουργία προεπισκόπησης και έχουμε συγκεκριμένη ερώτηση
      if (isPreview && specificQuestionId) {
        const questionId = parseInt(specificQuestionId);
        loadedQuestions = loadedQuestions.filter(q => q.id === questionId);
        
        if (loadedQuestions.length === 0) {
          toast.error("Η ερώτηση δεν βρέθηκε");
          navigate(`/subject/${subjectId}`);
          return;
        }
      }
      // Αν δεν έχουμε σε mode προεπισκόπησης, ανακατεύουμε τις ερωτήσεις
      else if (!isPreview) {
        // Ανακατεύουμε τις ερωτήσεις για normal quiz
        loadedQuestions = [...loadedQuestions].sort(() => Math.random() - 0.5);
        
        // Ανάλογα με τον τύπο του κουίζ, κρατάμε διαφορετικό αριθμό ερωτήσεων
        if (quizType === 'quick') {
          loadedQuestions = loadedQuestions.slice(0, 5);
        } else if (quizType === 'medium') {
          loadedQuestions = loadedQuestions.slice(0, 10);
        } else if (quizType === 'full') {
          loadedQuestions = loadedQuestions.slice(0, 15);
        }
      }
      
      setQuestions(loadedQuestions);
      setAnswers(new Array(loadedQuestions.length).fill(-1));
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση των ερωτήσεων:", error);
      uiToast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα κατά τη φόρτωση των ερωτήσεων. Παρακαλώ προσπαθήστε ξανά αργότερα.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [subjectId, quizType, getQuestions, navigate, uiToast, isPreview, specificQuestionId]);

  const handleBackClick = () => {
    if (isPreview) {
      navigate(-1); // Πίσω στην προηγούμενη σελίδα αν είμαστε σε προεπισκόπηση
    } else {
      // Αν είμαστε σε κανονικό κουίζ, ρωτάμε τον χρήστη αν θέλει να φύγει
      if (!quizCompleted && answers.some(a => a !== -1)) {
        const confirmExit = window.confirm("Είστε σίγουροι ότι θέλετε να εγκαταλείψετε το κουίζ; Η πρόοδός σας θα χαθεί.");
        if (!confirmExit) return;
      }
      navigate(`/subject/${subjectId}`);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      // Αποθηκεύουμε την απάντηση του χρήστη
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);

      // Αν είναι η τελευταία ερώτηση, ολοκληρώνουμε το κουίζ
      if (currentQuestionIndex === questions.length - 1) {
        // Υπολογίζουμε το σκορ
        let correctAnswers = 0;
        newAnswers.forEach((answer, index) => {
          if (answer === questions[index].correctAnswer) {
            correctAnswers++;
          }
        });
        const finalScore = Math.round((correctAnswers / questions.length) * 100);
        setScore(finalScore);
        setQuizCompleted(true);

        // Αποθηκεύουμε το αποτέλεσμα αν ο χρήστης είναι συνδεδεμένος
        if (isAuthenticated && user && !isPreview) {
          saveQuizResult(
            user.id,
            user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'Ανώνυμος',
            subjectId!,
            quizType as any,
            finalScore,
            questions.length,
            newAnswers
          );
        }
      } else {
        // Προχωράμε στην επόμενη ερώτηση
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }
    } else {
      uiToast({
        title: "Προσοχή",
        description: "Παρακαλώ επιλέξτε μια απάντηση πριν συνεχίσετε.",
        variant: "destructive",
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(-1));
    setQuizCompleted(false);
  };

  const handlePrintQuiz = () => {
    printQuiz(questions);
  };

  const handlePrintResults = () => {
    const subject = subjects.find(s => s.id === subjectId);
    printResults(
      subject?.name || 'Άγνωστο μάθημα',
      quizType || 'Άγνωστος τύπος',
      questions,
      answers,
      score
    );
  };

  const handleCopyLink = () => {
    if (isPreview && specificQuestionId) {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Ο σύνδεσμος αντιγράφηκε στο πρόχειρο", {
        description: "Μπορείτε να μοιραστείτε αυτόν τον σύνδεσμο με τους μαθητές σας."
      });
    }
  };

  const getCurrentQuestion = () => {
    if (questions.length === 0) return null;
    return questions[currentQuestionIndex];
  };

  const getQuizTypeName = () => {
    const typeNames: Record<string, string> = {
      'basic': 'Βασικό',
      'intermediate': 'Μεσαίο',
      'advanced': 'Προχωρημένο',
      'quick': 'Γρήγορο',
      'medium': 'Μεσαίο',
      'full': 'Πλήρες'
    };
    return typeNames[quizType || ''] || quizType;
  };

  const getSubjectName = () => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο μάθημα';
  };

  // Αν δεν έχουμε subject ή quizType, επιστρέφουμε στην αρχική σελίδα
  if (!subjectId || !quizType) {
    navigate('/');
    return null;
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isPreview ? 'Επιστροφή' : `Επιστροφή στο ${getSubjectName()}`}
          </Button>
          
          {/* Τίτλος */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{getSubjectName()}</h1>
              <p className="text-muted-foreground">
                {isPreview ? 'Προεπισκόπηση ερώτησης' : `${getQuizTypeName()} κουίζ`}
              </p>
            </div>
            
            {isPreview && specificQuestionId && (
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0"
                onClick={handleCopyLink}
              >
                <Share className="mr-2 h-4 w-4" />
                Αντιγραφή Συνδέσμου
              </Button>
            )}
            
            {!isPreview && !quizCompleted && (
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0"
                onClick={handlePrintQuiz}
              >
                <Printer className="mr-2 h-4 w-4" />
                Εκτύπωση Κουίζ
              </Button>
            )}
          </div>
          
          {loading ? (
            <Card className="mb-6">
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p>Φόρτωση ερωτήσεων...</p>
                </div>
              </CardContent>
            </Card>
          ) : questions.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="pt-6 text-center">
                <p className="py-12 text-muted-foreground">
                  Δεν υπάρχουν διαθέσιμες ερωτήσεις για αυτό το κουίζ.
                </p>
              </CardContent>
            </Card>
          ) : quizCompleted ? (
            <div>
              <QuizResults 
                score={score} 
                questions={questions} 
                userAnswers={answers} 
                onRestart={handleRestartQuiz}
                onPrint={handlePrintResults}
              />
            </div>
          ) : currentQuestion ? (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Ερώτηση {currentQuestionIndex + 1} από {questions.length}</CardTitle>
                  {!isPreview && (
                    <div className="text-sm text-muted-foreground">
                      Πρόοδος: {Math.round(((currentQuestionIndex) / questions.length) * 100)}%
                    </div>
                  )}
                </div>
                <CardDescription>
                  Επιλέξτε τη σωστή απάντηση
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer border ${
                          selectedAnswer === index ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <Radio
                          checked={selectedAnswer === index}
                          onCheckedChange={() => handleAnswerSelect(index)}
                        />
                        <label className="cursor-pointer flex-grow">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {isPreview && (
                    <div className="text-sm text-green-600 font-medium">
                      Σωστή απάντηση: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                  )}
                </div>
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex === questions.length - 1 ? 'Ολοκλήρωση' : 'Επόμενο'}
                </Button>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default QuizPage;
