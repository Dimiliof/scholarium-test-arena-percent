
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuestionFormValues } from './QuestionForm';

interface OptionsFieldsProps {
  form: UseFormReturn<QuestionFormValues>;
}

const OptionsFields: React.FC<OptionsFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default OptionsFields;
