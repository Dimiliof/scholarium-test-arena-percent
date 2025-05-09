import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronRight, RotateCcw, Award, Clock, PlayCircle, Video } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const DEMO_SUBJECT = 'mathematics'; // Σταθερό μάθημα για το demo

// Δημιουργία δοκιμαστικών ερωτήσεων αντί να τις πάρουμε από το sampleQuestions που δεν υπάρχει ακόμα
const demoQuestions = [
  {
    id: 1,
    question: 'Πόσο κάνει 2 + 2;',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1
  },
  {
    id: 2,
    question: 'Ποια είναι η τετραγωνική ρίζα του 9;',
    options: ['2', '3', '4', '9'],
    correctAnswer: 1
  },
  {
    id: 3,
    question: 'Πόσες μοίρες έχει ένα τρίγωνο;',
    options: ['90 μοίρες', '180 μοίρες', '270 μοίρες', '360 μοίρες'],
    correctAnswer: 1
  }
];

const QuizDemo = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 δευτερόλεπτα ανά ερώτηση
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Χρησιμοποιούμε τις δοκιμαστικές ερωτήσεις
  const [questions, setQuestions] = useState(demoQuestions);

  // Timer για κάθε ερώτηση
  useEffect(() => {
    if (isAnswered || isCompleted || showVideo) return;

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
  }, [isAnswered, currentQuestion, isCompleted, showVideo]);

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
    const shuffled = [...demoQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setTimeLeft(15);
    setShowVideo(false);
  };

  const toggleVideoDemo = () => {
    setShowVideo(!showVideo);
  };

  // Βίντεο Προσομοίωσης ECDL
  const VideoDemo = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Card className="w-full shadow-lg border-2 border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-black relative">
            <iframe 
              className="w-full h-full absolute inset-0"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&showinfo=0" 
              title="ECDL Simulation Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">Προσομοίωση ECDL</h3>
            <p className="text-gray-600 mb-4">
              Παρακολουθήστε πώς λειτουργούν οι προσομοιώσεις ECDL στην πλατφόρμα μας για τις ενότητες Word, Excel και PowerPoint.
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <Button variant="outline" onClick={toggleVideoDemo}>
                Δοκιμάστε το Quiz Demo
              </Button>
              <Button onClick={() => navigate('/subject/ecdl-word')} className="flex items-center gap-2">
                Δοκιμάστε το ECDL
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Κώδικας ενσωμάτωσης για εξωτερικές ιστοσελίδες */}
      <div className="mt-6 w-full max-w-xl mx-auto">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Κώδικας ενσωμάτωσης για την ιστοσελίδα σας:</h4>
        <div className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
          <code>
            {`<iframe width="560" height="315" src="https://www.yourwebsite.com/ecdl-demo-embed" title="ECDL Simulation Demo" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`}
          </code>
        </div>
      </div>
    </motion.div>
  );

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
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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
                  <Button onClick={toggleVideoDemo} variant="outline" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Δείτε το ECDL Video
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

  if (showVideo) {
    return <VideoDemo />;
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-primary"
              onClick={toggleVideoDemo}
            >
              <PlayCircle className="h-4 w-4" />
              Δείτε το ECDL Video
            </Button>
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
