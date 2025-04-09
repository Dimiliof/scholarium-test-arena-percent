
import { QuizQuestion } from "@/lib/subjectsData";
import { QuestionForm } from "@/components/question-form/QuestionForm";
import { QuizType } from "@/components/question-form/types";

// Re-export the QuizType enum for backward compatibility
export { QuizType } from "@/components/question-form/types";

interface AddQuestionFormProps {
  subjectId: string;
  onSuccess?: () => void;
  initialData?: QuizQuestion;
  initialQuizType?: QuizType;
}

export function AddQuestionForm({ 
  subjectId, 
  onSuccess, 
  initialData, 
  initialQuizType = QuizType.BASIC
}: AddQuestionFormProps) {
  return (
    <QuestionForm
      subjectId={subjectId}
      onSuccess={onSuccess}
      initialData={initialData}
      initialQuizType={initialQuizType}
    />
  );
}
