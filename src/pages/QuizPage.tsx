
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizResults from '@/components/QuizResults';
import { subjects, sampleQuestions, QuizQuestion } from '@/lib/subjectsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const QuizPage = () => {
  const { subjectId, quizType } = useParams<{ subjectId: string; quizType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const subject = subjects.find(s => s.id === subjectId);
  
  // Determine time limit based on quiz type
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
  
  // Set up timer
  useEffect(() => {
    if (timeLeft <= 0 || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit quiz if time runs out
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
  
  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Load questions
  useEffect(() => {
    if (!subjectId) return;
    
    setIsLoading(true);
    
    // Get questions for this subject
    const availableQuestions = sampleQuestions[subjectId] || [];
    
    if (availableQuestions.length === 0) {
      toast({
        title: "Δεν βρέθηκαν ερωτήσεις",
        description: "Δεν υπάρχουν διαθέσιμες ερωτήσεις για αυτό το μάθημα.",
        variant: "destructive"
      });
      navigate(`/subject/${subjectId}`);
      return;
    }
    
    // Determine number of questions based on quiz type
    let numQuestions = 5; // Default
    if (quizType === 'medium') numQuestions = 10;
    if (quizType === 'full') numQuestions = 15;
    
    // Limit to available questions
    numQuestions = Math.min(numQuestions, availableQuestions.length);
    
    // Shuffle and select questions
    const shuffledQuestions = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
    
    setQuestions(selectedQuestions);
    
    // Initialize user answers array
    setUserAnswers(new Array(numQuestions).fill(-1));
    setIsLoading(false);
  }, [subjectId, quizType, navigate, toast]);
  
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
  
  // Get quiz title based on type
  const getQuizTitle = () => {
    switch (quizType) {
      case 'basic': return 'Βασικές Ασκήσεις';
      case 'intermediate': return 'Ενδιάμεσες Ασκήσεις';
      case 'advanced': return 'Προχωρημένες Ασκήσεις';
      case 'quick': return 'Διαγώνισμα 15 λεπτών';
      case 'medium': return 'Διαγώνισμα 30 λεπτών';
      case 'full': return 'Διαγώνισμα Εφ\' Όλης της Ύλης';
      default: return 'Εξάσκηση';
    }
  };
  
  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    
    // Update user answers
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
    
    // Move to next question or complete quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(userAnswers[currentQuestion + 1] !== -1 ? userAnswers[currentQuestion + 1] : null);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(userAnswers[currentQuestion - 1] !== -1 ? userAnswers[currentQuestion - 1] : null);
    }
  };
  
  // Handle retry quiz
  const handleRetry = () => {
    setCurrentQuestion(0);
    setUserAnswers(new Array(questions.length).fill(-1));
    setSelectedOption(null);
    setQuizCompleted(false);
    
    // Reset timer based on quiz type
    let seconds = 0;
    switch (quizType) {
      case 'quick': seconds = 15 * 60; break;
      case 'medium': seconds = 30 * 60; break;
      case 'full': seconds = 45 * 60; break;
      default: seconds = 10 * 60; break;
    }
    setTimeLeft(seconds);
  };
  
  // If the quiz is completed, show results
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
  
  // If questions are still loading
  if (isLoading || questions.length === 0) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{getQuizTitle()}</h1>
                <p className="text-gray-600">{subject.name}</p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">
                Ερώτηση {currentQuestion + 1} από {questions.length}
              </span>
              <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2 flex-grow" />
            </div>
          </div>
          
          {/* Quiz Question */}
          <Card className="shadow mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-6">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
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
            
            <CardFooter className="flex justify-between p-6 border-t">
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
          
          {/* Warning when time is almost up */}
          {timeLeft < 60 && !quizCompleted && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
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
