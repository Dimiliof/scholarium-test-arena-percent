import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizResults from '@/components/QuizResults';
import { subjects, QuizQuestion } from '@/lib/subjectsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, AlertCircle, Wrench, PlusCircle, Printer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';
import { QuizType } from '@/components/AddQuestionForm';
import { usePrintQuiz } from '@/hooks/usePrintQuiz';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const QuizPage = () => {
  const { subjectId, quizType } = useParams<{ subjectId: string; quizType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const { getQuestions } = useQuestionManagement();
  const { componentRef, handlePrint } = usePrintQuiz();
  
  const hasAccess = isAuthenticated && (isTeacher || isAdmin);
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-12">
          <Card className="bg-amber-50 border-amber-200 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-200 p-4 rounded-full mb-6">
                  <AlertCircle className="h-10 w-10 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-amber-800 mb-4">
                  Περιορισμένη Πρόσβαση
                </h1>
                <p className="text-amber-700 mb-6 max-w-lg">
                  Ως μαθητής έχετε πρόσβαση μόνο στα εργαλεία της πλατφόρμας. 
                  Δεν μπορείτε να συμμετέχετε σε διαγωνίσματα και ασκήσεις.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link to="/">
                    <Button variant="outline">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Επιστροφή στην αρχική
                    </Button>
                  </Link>
                  <Link to="/tools/calculator">
                    <Button>
                      <Wrench className="h-4 w-4 mr-2" />
                      Μετάβαση στα εργαλεία
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const subject = subjects.find(s => s.id === subjectId);
  
  useEffect(() => {
    if (!quizType) return;
    
    let seconds = 0;
    switch (quizType) {
      case 'quick':
        seconds = 15 * 60; // 15 minutes
        break;
      case 'medium':
        seconds = 30 * 60; // 30 minutes
        break;
      case 'full':
        seconds = 45 * 60; // 45 minutes
        break;
      default:
        seconds = 10 * 60; // 10 minutes for practice
        break;
    }
    
    setTimeLeft(seconds);
  }, [quizType]);
  
  useEffect(() => {
    if (timeLeft <= 0 || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!quizCompleted) {
            toast({
              title: "Ο χρόνος τελείωσε!",
              description: "Το διαγώνισμα υποβλήθηκε αυτόματα.",
              variant: "destructive"
            });
            setQuizCompleted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted, toast]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  useEffect(() => {
    if (!subjectId || !quizType) return;
    
    setIsLoading(true);
    console.log("Loading questions for subject:", subjectId, "quiz type:", quizType);
    
    let quizTypeEnum: QuizType;
    
    switch(quizType) {
      case 'basic':
        quizTypeEnum = QuizType.BASIC;
        break;
      case 'intermediate':
        quizTypeEnum = QuizType.INTERMEDIATE;
        break;
      case 'advanced':
        quizTypeEnum = QuizType.ADVANCED;
        break;
      case 'quick':
        quizTypeEnum = QuizType.QUICK;
        break;
      case 'medium':
        quizTypeEnum = QuizType.MEDIUM;
        break;
      case 'full':
        quizTypeEnum = QuizType.FULL;
        break;
      default:
        quizTypeEnum = QuizType.BASIC;
    }
    
    console.log("Quiz type enum:", quizTypeEnum);
    const availableQuestions = getQuestions(subjectId, quizTypeEnum);
    console.log("Available questions:", availableQuestions);
    
    if (availableQuestions.length === 0) {
      console.log("No questions found");
      setIsLoading(false);
      return;
    }
    
    let numQuestions = 5; // Default
    if (quizType === 'medium') numQuestions = 10;
    if (quizType === 'full') numQuestions = 15;
    
    numQuestions = Math.min(numQuestions, availableQuestions.length);
    
    const shuffledQuestions = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
    
    console.log("Selected questions:", selectedQuestions);
    setQuestions(selectedQuestions);
    
    setUserAnswers(new Array(numQuestions).fill(-1));
    setIsLoading(false);
  }, [subjectId, quizType, getQuestions]);
  
  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Το μάθημα δεν βρέθηκε</h1>
            <Button onClick={() => navigate('/')}>Επιστροφή στην αρχική</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  function getQuizTitle() {
    switch (quizType) {
      case 'basic': return 'Βασικές Ασκήσεις';
      case 'intermediate': return 'Ενδιάμεσες Ασκήσεις';
      case 'advanced': return 'Προχωρημένες Ασκήσεις';
      case 'quick': return 'Διαγώνισμα 15 λεπτών';
      case 'medium': return 'Διαγώνισμα 30 λεπτών';
      case 'full': return 'Διαγώνισμα Εφ\' Όλης της Ύλης';
      default: return 'Εξάσκηση';
    }
  }
  
  function handleOptionSelect(optionIndex: number) {
    setSelectedOption(optionIndex);
  }
  
  function handleNextQuestion() {
    if (selectedOption === null) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(userAnswers[currentQuestion + 1] !== -1 ? userAnswers[currentQuestion + 1] : null);
    } else {
      setQuizCompleted(true);
    }
  }
  
  function handlePreviousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(userAnswers[currentQuestion - 1] !== -1 ? userAnswers[currentQuestion - 1] : null);
    }
  }
  
  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow py-8">
          <QuizResults 
            questions={questions} 
            userAnswers={userAnswers} 
            subject={subject}
            quizType={getQuizTitle()}
            onRetry={handleRetry}
          />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Φόρτωση ερωτήσεων...</h1>
            <p className="text-gray-600">Παρακαλώ περιμένετε</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-12">
          <Card className="bg-blue-50 border-blue-200 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-6">
                  <AlertCircle className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-blue-800 mb-4">
                  Δεν υπάρχει διαθέσιμο υλικό
                </h1>
                <p className="text-blue-700 mb-6 max-w-lg">
                  Δεν υπάρχουν ακόμα διαθέσιμες ερωτήσεις για το {getQuizTitle()} στο μάθημα {subject.name}.
                </p>

                {(isTeacher || isAdmin) && (
                  <div className="mb-6">
                    <p className="text-blue-700 mb-4">
                      Ως εκπαιδευτικός, μπορείτε να προσθέσετε ερωτήσεις για να δημιουργήσετε υλικό εξάσκησης για τους μαθητές.
                    </p>
                    <Link to="/add-content">
                      <Button className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Προσθήκη Ερωτήσεων
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link to={`/subject/${subjectId}`}>
                    <Button variant="outline">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Επιστροφή στο μάθημα
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Επιστροφή στην αρχική
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{getQuizTitle()}</h1>
                <p className="text-gray-600">{subject?.name || 'Μάθημα'}</p>
              </div>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrint}
                        className="no-print"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Εκτύπωση διαγωνίσματος
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-2 progress-indicator">
              <span className="text-sm text-gray-600 mr-2">
                Ερώτηση {currentQuestion + 1} από {questions.length}
              </span>
              <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2 flex-grow" />
            </div>
          </div>
          
          <div ref={componentRef} className="print-container">
            <div className="print-header">
              <h1 className="text-2xl font-bold">{getQuizTitle()}</h1>
              <p className="text-gray-600">{subject.name}</p>
              <p className="text-sm text-gray-500">Συνολικός αριθμός ερωτήσεων: {questions.length}</p>
            </div>
            
            {questions.length > 0 && (
              <Card className="shadow mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-6">
                    {currentQuestion + 1}. {questions[currentQuestion]?.question}
                  </h2>
                  
                  <div className="space-y-3">
                    <p className="options-label">Επιλογές:</p>
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedOption === index 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            selectedOption === index 
                              ? 'bg-primary text-white' 
                              : 'border border-gray-300'
                          }`}>
                            <span className="text-sm">
                              {selectedOption === index ? '✓' : String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between p-6 border-t quiz-controls">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Προηγούμενο
                  </Button>
                  
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className="flex items-center"
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Επόμενο
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      'Ολοκλήρωση'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <div className="print-footer">
              <p>© {new Date().getFullYear()} - Εκπαιδευτική Πλατφόρμα</p>
            </div>
          </div>
          
          {timeLeft < 60 && !quizCompleted && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center no-print">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-600">Ο χρόνος τελειώνει! Λιγότερο από ένα λεπτό απομένει.</span>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizPage;
