import React from 'react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email.",
  }),
  subject: z.string().min(5, {
    message: "Το θέμα πρέπει να έχει τουλάχιστον 5 χαρακτήρες.",
  }),
  message: z.string().min(10, {
    message: "Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Προσομοίωση αποστολής μηνύματος
    setTimeout(() => {
      console.log("Δεδομένα φόρμας επικοινωνίας:", data);
      
      toast({
        title: "Το μήνυμα εστάλη!",
        description: "Σας ευχαριστούμε για την επικοινωνία. Θα απαντήσουμε σύντομα.",
      });
      
      setIsSubmitting(false);
      form.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Επικοινωνία</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-lg mb-6">
                Θα χαρούμε να απαντήσουμε σε οποιεσδήποτε ερωτήσεις ή σχόλια έχετε. 
                Συμπληρώστε τη φόρμα επικοινωνίας ή επικοινωνήστε μαζί μας απευθείας.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Email:</h3>
                  <a href="mailto:dimitris.liofis@atsoglou.gr" className="text-primary hover:underline">
                    dimitris.liofis@atsoglou.gr
                  </a>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">WhatsApp Business:</h3>
                  <a 
                    href="https://wa.me/+306946930288" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                      <path d="M12.02 2C6.21 2 2 6.74 2 12c0 1.68.49 3.41 1.35 4.99L2 22l5.25-1.38c1.57.86 3.35 1.36 5.07 1.36 5.81 0 10.38-4.74 10.38-10.5C22.7 6.74 17.79 2 12.02 2zm5.81 14.12c-.25.63-1.26 1.2-1.77 1.25-.5.07-.99.35-3.25-1-2.26-1.35-3.75-3.88-3.87-4.08-.12-.2-1-1.33-1-2.54 0-1.2.62-1.8.87-2.05.25-.25.62-.38 1-.38.12 0 .25.01.37.07.12.06.27.19.42.44.18.3.62 1.08.67 1.16.06.08.1.19.03.37-.07.18-.4.74-.4.74s-.12.25.07.45c.18.2.78.79 1.58 1.28.58.4 1.08.51 1.28.59.2.07.33.06.45-.04.12-.1.42-.49.53-.66.12-.17.24-.14.42-.09.18.06 1.12.53 1.32.63.2.1.33.15.37.24.05.09.05.53-.2 1.05z"/>
                    </svg>
                    Επικοινωνία μέσω WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Φόρμα Επικοινωνίας</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Όνομα</FormLabel>
                        <FormControl>
                          <Input placeholder="Το όνομά σας" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Το email σας" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Θέμα</FormLabel>
                        <FormControl>
                          <Input placeholder="Θέμα μηνύματος" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Μήνυμα</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Το μήνυμά σας" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Αποστολή... <span className="animate-spin ml-1">⟳</span></>
                    ) : (
                      'Αποστολή Μηνύματος'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Αν είστε από σχολείο και ενδιαφέρεστε για την πλατφόρμα μας, 
              μπορείτε να εγγραφείτε μέσω της ειδικής φόρμας.
            </p>
            <Link to="/school-registration">
              <Button variant="outline">Εγγραφή Σχολείου</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
