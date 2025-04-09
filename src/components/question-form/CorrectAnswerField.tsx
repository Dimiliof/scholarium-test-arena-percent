
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { QuestionFormValues } from './QuestionForm';

interface CorrectAnswerFieldProps {
  form: UseFormReturn<QuestionFormValues>;
}

const CorrectAnswerField: React.FC<CorrectAnswerFieldProps> = ({ form }) => {
  return (
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
  );
};

export default CorrectAnswerField;
