
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestion, Subject } from "@/lib/subjectsData";
import { Check, X, RotateCcw, Printer } from "lucide-react";
import { usePrintResults } from "@/hooks/usePrintResults";

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  subject: Subject;
  quizType: string;
  onRetry: () => void;
}

const QuizResults = ({ questions, userAnswers, subject, quizType, onRetry }: QuizResultsProps) => {
  const correctAnswers = userAnswers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: "Άριστα", color: "text-green-600" };
    if (percentage >= 80) return { grade: "Πολύ καλά", color: "text-green-500" };
    if (percentage >= 70) return { grade: "Καλά", color: "text-blue-500" };
    if (percentage >= 60) return { grade: "Μέτρια", color: "text-yellow-500" };
    if (percentage >= 50) return { grade: "Επαρκώς", color: "text-orange-500" };
    return { grade: "Ανεπαρκώς", color: "text-red-500" };
  };
  
  const { grade, color } = getGrade();
  
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('el-GR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const { componentRef, handlePrint } = usePrintResults();
  
  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Αποτελέσματα {quizType}</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Εκτύπωση
        </Button>
      </div>
      
      <div ref={componentRef} className="print-container">
        <div className="print-header">
          <h1 className="text-2xl font-bold">{subject.name} - {quizType}</h1>
          <p className="text-gray-500">Ημερομηνία: {getCurrentDate()}</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>Σύνοψη</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <span className="text-4xl font-bold">
                {correctAnswers}/{questions.length}
              </span>
              <p className="text-gray-500">σωστές απαντήσεις</p>
            </div>
            <div className="mb-4">
              <span className={`text-4xl font-bold ${color}`}>
                {percentage}%
              </span>
              <p className={`${color} font-medium`}>{grade}</p>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-bold mb-4">Αναλυτικά Αποτελέσματα</h2>
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="question-container border rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div>
                  {userAnswers[index] === question.correctAnswer ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-1 ml-1">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={`
                        text-sm p-2 rounded 
                        ${optionIndex === question.correctAnswer ? 'bg-green-50 text-green-700' : ''}
                        ${optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer ? 'bg-red-50 text-red-700' : ''}
                        ${optionIndex !== userAnswers[index] && optionIndex !== question.correctAnswer ? 'text-gray-600' : ''}
                      `}>
                        <div className="flex items-center">
                          <span className="mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <Check className="h-4 w-4 ml-2 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="print-footer">
          <p>© {new Date().getFullYear()} - Εκπαιδευτική Πλατφόρμα</p>
        </div>
      </div>
      
      <div className="flex justify-center mt-8 no-print">
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Επανάληψη
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
