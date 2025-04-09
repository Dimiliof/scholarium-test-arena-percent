
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QuizQuestion } from "@/lib/subjectsData";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { QuizType } from "./types";
import QuestionField from "./QuestionField";
import OptionsFields from "./OptionsFields";
import CorrectAnswerField from "./CorrectAnswerField";
import QuizTypeField from "./QuizTypeField";

const questionSchema = z.object({
  question: z.string().min(5, {
    message: "Η ερώτηση πρέπει να έχει τουλάχιστον 5 χαρακτήρες",
  }),
  optionA: z.string().min(1, {
    message: "Συμπληρώστε την επιλογή Α",
  }),
  optionB: z.string().min(1, {
    message: "Συμπληρώστε την επιλογή Β",
  }),
  optionC: z.string().min(1, {
    message: "Συμπληρώστε την επιλογή Γ",
  }),
  optionD: z.string().min(1, {
    message: "Συμπληρώστε την επιλογή Δ",
  }),
  correctAnswer: z.enum(["0", "1", "2", "3"], {
    required_error: "Επιλέξτε τη σωστή απάντηση",
  }),
  quizType: z.enum(["basic", "intermediate", "advanced", "quick", "medium", "full"], {
    required_error: "Επιλέξτε τον τύπο του κουίζ",
  }),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  subjectId: string;
  onSuccess?: () => void;
  initialData?: QuizQuestion;
  initialQuizType?: QuizType;
}

export function QuestionForm({ 
  subjectId, 
  onSuccess, 
  initialData, 
  initialQuizType = QuizType.BASIC
}: QuestionFormProps) {
  const { addQuestion, editQuestion, isLoading } = useQuestionManagement();
  const isEditing = !!initialData;
  
  const defaultValues: QuestionFormValues = isEditing 
    ? {
        question: initialData.question,
        optionA: initialData.options[0],
        optionB: initialData.options[1],
        optionC: initialData.options[2],
        optionD: initialData.options[3],
        correctAnswer: String(initialData.correctAnswer) as "0" | "1" | "2" | "3",
        quizType: initialQuizType.toString() as "basic" | "intermediate" | "advanced" | "quick" | "medium" | "full",
      }
    : {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "0" as "0" | "1" | "2" | "3",
        quizType: initialQuizType.toString() as "basic" | "intermediate" | "advanced" | "quick" | "medium" | "full",
      };
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const onSubmit = (data: QuestionFormValues) => {
    const questionData: QuizQuestion = {
      id: isEditing ? initialData.id : Date.now(),
      question: data.question,
      options: [data.optionA, data.optionB, data.optionC, data.optionD],
      correctAnswer: parseInt(data.correctAnswer),
    };
    
    if (isEditing) {
      editQuestion(subjectId, questionData, data.quizType as unknown as QuizType, initialQuizType);
    } else {
      addQuestion(subjectId, questionData, data.quizType as unknown as QuizType);
    }
    
    if (onSuccess) {
      onSuccess();
    }
    
    if (!isEditing) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <QuestionField form={form} />
        <OptionsFields form={form} />
        <CorrectAnswerField form={form} />
        <QuizTypeField form={form} />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Αποθήκευση..." : isEditing ? "Ενημέρωση Ερώτησης" : "Προσθήκη Ερώτησης"}
        </Button>
      </form>
    </Form>
  );
}

export default QuestionForm;
