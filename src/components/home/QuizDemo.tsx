
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronRight, RotateCcw, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion } from "@/components/ui/motion";
import { sampleQuestions } from '@/lib/subjectsData';
import { useNavigate } from 'react-router-dom';

const DEMO_SUBJECT = 'mathematics'; // Σταθερό μάθημα για το demo

const QuizDemo = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 δευτερόλεπτα ανά ερώτηση

  // Επιλογή 3 τυχαίων ερωτήσεων από τα μαθηματικά
  const [questions, setQuestions] = useState(() => {
    const allQuestions = sampleQuestions[DEMO_SUBJECT];
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Επιστρέφει τις πρώτες 3 ερωτήσεις
  });

  // Timer για κάθε ερώτηση
  useEffect(() => {
    if (isAnswered || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Αυτόματη λήξη χρόνου
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, currentQuestion, isCompleted]);

  const handleAnswer = (answerIndex: number | null) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    // Ελέγχουμε αν η απάντηση είναι σωστή
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    // Ανακατεύουμε τις ερωτήσεις για ένα νέο σετ
    const allQuestions = sampleQuestions[DEMO_SUBJECT];
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 3));
    
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setTimeLeft(15);
  };

  // Προβολή αποτελεσμάτων
  if (isCompleted) {
    return (
      <Card className="shadow-lg border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center">
            <Award className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ολοκληρώσατε το Demo Quiz!</h3>
            <p className="text-gray-600 mb-6">Συγκεντρώσατε {score} από {questions.length} σωστές απαντήσεις.</p>
            
            <div className="w-full max-w-xs mx-auto mb-8">
              <Progress value={(score / questions.length) * 100} className="h-2" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={resetQuiz} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Δοκιμάστε ξανά
              </Button>
              <Button onClick={() => navigate('/subject/mathematics')} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                Εξερεύνηση μαθημάτων
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Τρέχουσα ερώτηση
  const currentQ = questions[currentQuestion];

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="p-6 pt-8">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Δοκιμαστικό Quiz
          </Badge>
          <div className="text-sm">
            Ερώτηση {currentQuestion + 1} από {questions.length}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-500">Χρόνος</div>
          <div className="text-sm font-medium">{timeLeft} δευτερόλεπτα</div>
        </div>
        <Progress value={(timeLeft / 15) * 100} className="h-2 mb-6" />
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                onClick={() => !isAnswered && handleAnswer(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isAnswered
                    ? index === currentQ.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : index === selectedAnswer
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                    : "border-gray-200 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>{option}</div>
                  {isAnswered && index === currentQ.correctAnswer && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== currentQ.correctAnswer && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {isAnswered && (
          <div className="flex justify-end">
            <Button onClick={handleNextQuestion} className="flex items-center gap-2">
              {currentQuestion < questions.length - 1 ? "Επόμενη ερώτηση" : "Δείτε τα αποτελέσματα"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizDemo;
