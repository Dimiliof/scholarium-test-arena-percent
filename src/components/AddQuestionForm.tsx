import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizQuestion } from "@/lib/subjectsData";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";

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

type QuestionFormValues = z.infer<typeof questionSchema>;

interface AddQuestionFormProps {
  subjectId: string;
  onSuccess?: () => void;
  initialData?: QuizQuestion;
  initialQuizType?: string;
}

export function AddQuestionForm({ 
  subjectId, 
  onSuccess, 
  initialData, 
  initialQuizType = "basic" 
}: AddQuestionFormProps) {
  const { addQuestion, editQuestion, isLoading } = useQuestionManagement();
  const isEditing = !!initialData;
  
  const defaultValues = isEditing 
    ? {
        question: initialData.question,
        optionA: initialData.options[0],
        optionB: initialData.options[1],
        optionC: initialData.options[2],
        optionD: initialData.options[3],
        correctAnswer: initialData.correctAnswer.toString() as "0" | "1" | "2" | "3",
        quizType: initialQuizType,
      }
    : {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        quizType: initialQuizType,
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
      editQuestion(subjectId, questionData, data.quizType, initialQuizType);
    } else {
      addQuestion(subjectId, questionData, data.quizType);
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
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ερώτηση</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Εισάγετε την ερώτηση εδώ..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="optionA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιλογή Α</FormLabel>
                <FormControl>
                  <Input placeholder="Επιλογή Α" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="optionB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιλογή Β</FormLabel>
                <FormControl>
                  <Input placeholder="Επιλογή Β" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="optionC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιλογή Γ</FormLabel>
                <FormControl>
                  <Input placeholder="Επιλογή Γ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="optionD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιλογή Δ</FormLabel>
                <FormControl>
                  <Input placeholder="Επιλογή Δ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Σωστή Απάντηση</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Επιλογή Α
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Επιλογή Β
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Επιλογή Γ
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Επιλογή Δ
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quizType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Τύπος Quiz</FormLabel>
              <FormDescription>
                Επιλέξτε σε ποιο τύπο quiz θα προστεθεί η ερώτηση
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="basic" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Βασικές Ασκήσεις
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="intermediate" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Ενδιάμεσες Ασκήσεις
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="advanced" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Προχωρημένες Ασκήσεις
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="quick" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Διαγώνισμα 15 λεπτών
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="medium" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Διαγώνισμα 30 λεπτών
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="full" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Διαγώνισμα Εφ' Όλης της Ύλης
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Αποθήκευση..." : isEditing ? "Ενημέρωση Ερώτησης" : "Προσθήκη Ερώτησης"}
        </Button>
      </form>
    </Form>
  );
}
