
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Ο τίτλος πρέπει να είναι τουλάχιστον 5 χαρακτήρες.",
  }).max(100, {
    message: "Ο τίτλος δεν μπορεί να ξεπερνά τους 100 χαρακτήρες.",
  }),
  content: z.string().min(10, {
    message: "Το περιεχόμενο πρέπει να είναι τουλάχιστον 10 χαρακτήρες.",
  }),
});

interface NewPostFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τίτλος</FormLabel>
              <FormControl>
                <Input placeholder="Εισάγετε τίτλο για την ανάρτησή σας" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Περιεχόμενο</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Περιγράψτε την ερώτηση ή το θέμα που θέλετε να συζητήσετε..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Ακύρωση
          </Button>
          <Button type="submit">
            Δημοσίευση
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPostForm;
