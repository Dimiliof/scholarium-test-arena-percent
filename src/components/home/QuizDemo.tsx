
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronRight, RotateCcw, Award, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { sampleQuestions } from '@/lib/subjectsData';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const DEMO_SUBJECT = 'mathematics'; // Σταθερό μάθημα για το demo

const QuizDemo = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 δευτερόλεπτα ανά ερώτηση
  const [carouselApi, setCarouselApi] = useState<any>(null);

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

  // Effect για το carousel
  useEffect(() => {
    if (carouselApi && !isAnswered) {
      carouselApi.scrollTo(0);
    }
  }, [carouselApi, currentQuestion, isAnswered]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <Award className="h-16 w-16 mx-auto text-primary mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Ολοκληρώσατε το Demo Quiz!</h3>
              <p className="text-gray-600 mb-6">Συγκεντρώσατε {score} από {questions.length} σωστές απαντήσεις.</p>
              
              <div className="w-full max-w-xs mx-auto mb-8">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(score / questions.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-primary h-2 rounded"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={resetQuiz} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Δοκιμάστε ξανά
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => navigate('/subject/mathematics')} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Εξερεύνηση μαθημάτων
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Τρέχουσα ερώτηση
  const currentQ = questions[currentQuestion];

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
        <CardContent className="p-6 pt-8">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
              Δοκιμαστικό Quiz
            </Badge>
            <div className="text-sm font-semibold">
              Ερώτηση {currentQuestion + 1} από {questions.length}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Χρόνος
            </div>
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
            >
              {timeLeft} δευτερόλεπτα
            </motion.div>
          </div>
          <div className="relative h-2 mb-6 bg-gray-100 rounded overflow-hidden">
            <motion.div
              className="absolute h-full bg-primary"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 15) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: isAnswered ? 1 : 1.02, boxShadow: isAnswered ? "none" : "0px 4px 8px rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => !isAnswered && handleAnswer(index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                    {isAnswered && index === selectedAnswer && index !== currentQ.correctAnswer && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {isAnswered && (
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleNextQuestion} className="flex items-center gap-2">
                  {currentQuestion < questions.length - 1 ? "Επόμενη ερώτηση" : "Δείτε τα αποτελέσματα"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizDemo;
