
import React from 'react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { QuestionFormValues } from './QuestionForm';

interface QuizTypeFieldProps {
  form: UseFormReturn<QuestionFormValues>;
}

const QuizTypeField: React.FC<QuizTypeFieldProps> = ({ form }) => {
  return (
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
  );
};

export default QuizTypeField;
