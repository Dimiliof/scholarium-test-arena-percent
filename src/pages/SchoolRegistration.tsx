
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { School, CheckCheck } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  schoolName: z.string().min(2, {
    message: "Το όνομα του σχολείου πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  directorName: z.string().min(2, {
    message: "Το όνομα του διευθυντή πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email.",
  }),
  phone: z.string().min(10, {
    message: "Ο αριθμός τηλεφώνου πρέπει να έχει τουλάχιστον 10 ψηφία.",
  }),
  address: z.string().min(5, {
    message: "Η διεύθυνση πρέπει να έχει τουλάχιστον 5 χαρακτήρες.",
  }),
  city: z.string().min(2, {
    message: "Η πόλη πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  postalCode: z.string().min(5, {
    message: "Ο ταχυδρομικός κώδικας πρέπει να έχει τουλάχιστον 5 ψηφία.",
  }),
  educationLevel: z.enum(["primary", "middle", "high"], {
    required_error: "Παρακαλώ επιλέξτε επίπεδο εκπαίδευσης.",
  }),
  numberOfStudents: z.string().min(1, {
    message: "Παρακαλώ εισάγετε τον αριθμό μαθητών.",
  }),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Πρέπει να αποδεχτείτε τους όρους χρήσης.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SchoolRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      directorName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      educationLevel: "primary",
      numberOfStudents: "",
      additionalInfo: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Προσομοίωση αποστολής δεδομένων
    setTimeout(() => {
      console.log("Δεδομένα εγγραφής σχολείου:", data);
      
      toast({
        title: "Επιτυχής Εγγραφή!",
        description: "Το σχολείο σας έχει εγγραφεί επιτυχώς. Θα επικοινωνήσουμε σύντομα μαζί σας.",
      });
      
      setIsSubmitting(false);
      
      // Ανακατεύθυνση στην αρχική σελίδα μετά από 2 δευτερόλεπτα
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <School className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Εγγραφή Σχολείου</h1>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-green-800">
              Συμπληρώστε την παρακάτω φόρμα για να εγγράψετε το σχολείο σας στην εκπαιδευτική πλατφόρμα μας. 
              Η πλατφόρμα είναι <strong>δωρεάν</strong> για όλα τα σχολεία.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα Σχολείου *</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. 1ο Γυμνάσιο Αθηνών" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="directorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα Διευθυντή *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ονοματεπώνυμο Διευθυντή" {...field} />
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="school@example.gr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τηλέφωνο *</FormLabel>
                      <FormControl>
                        <Input placeholder="2101234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Διεύθυνση *</FormLabel>
                      <FormControl>
                        <Input placeholder="Οδός και αριθμός" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Πόλη *</FormLabel>
                        <FormControl>
                          <Input placeholder="π.χ. Αθήνα" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Τ.Κ. *</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επίπεδο Εκπαίδευσης *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          {...field}
                        >
                          <option value="primary">Δημοτικό</option>
                          <option value="middle">Γυμνάσιο</option>
                          <option value="high">Λύκειο</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numberOfStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Αριθμός Μαθητών *</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. 150" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Επιπλέον Πληροφορίες</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Προσθέστε οποιαδήποτε επιπλέον πληροφορία θεωρείτε σημαντική" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Προαιρετικό: Ειδικές ανάγκες, επιπλέον στοιχεία επικοινωνίας, κλπ.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Αποδέχομαι τους <Link to="/terms" className="text-primary hover:underline">όρους χρήσης</Link> και την <Link to="/privacy" className="text-primary hover:underline">πολιτική απορρήτου</Link> *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Υποβολή... <span className="animate-spin ml-1">⟳</span></>
                ) : (
                  <>Εγγραφή Σχολείου <CheckCheck className="ml-2" /></>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>* Υποχρεωτικά πεδία</p>
            <p className="mt-2">
              Για οποιαδήποτε απορία, επικοινωνήστε μαζί μας στο email: <a href="mailto:dimitris.liofis@atsoglou.gr" className="text-primary hover:underline">dimitris.liofis@atsoglou.gr</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchoolRegistration;
