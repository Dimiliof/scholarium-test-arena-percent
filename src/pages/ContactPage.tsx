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
import { MessageCircle } from 'lucide-react';

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
                  <h3 className="font-bold text-lg mb-2">Επικοινωνία:</h3>
                  <a 
                    href={`https://wa.me/+306946930288?text=${encodeURIComponent("Γεια σας, θα ήθελα να επικοινωνήσω σχετικά με το EduPercentage.")}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500" />
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
