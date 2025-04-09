
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuestionFormValues } from './QuestionForm';

interface QuestionFieldProps {
  form: UseFormReturn<QuestionFormValues>;
}

const QuestionField: React.FC<QuestionFieldProps> = ({ form }) => {
  return (
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
  );
};

export default QuestionField;
