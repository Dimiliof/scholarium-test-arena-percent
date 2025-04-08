
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  lastName: z.string().min(2, {
    message: "Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email.",
  }),
  password: z.string().min(8, {
    message: "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Οι κωδικοί πρόσβασης δεν ταιριάζουν.",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Registration data:", values);
      
      // Successful registration toast
      toast({
        title: "Επιτυχής εγγραφή",
        description: "Ο λογαριασμός σας δημιουργήθηκε επιτυχώς. Μπορείτε να συνδεθείτε τώρα.",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      
      toast({
        title: "Σφάλμα εγγραφής",
        description: "Παρουσιάστηκε σφάλμα κατά την εγγραφή. Παρακαλώ προσπαθήστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Εγγραφή</CardTitle>
              <CardDescription>
                Δημιουργήστε το λογαριασμό σας στην πλατφόρμα ΕκπαιδευτικήΓωνιά
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Όνομα</FormLabel>
                          <FormControl>
                            <Input placeholder="Όνομα" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Επώνυμο</FormLabel>
                          <FormControl>
                            <Input placeholder="Επώνυμο" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Κωδικός πρόσβασης</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Επιβεβαίωση κωδικού</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Εγγραφή..." : "Εγγραφή"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm">
                <p>
                  Έχετε ήδη λογαριασμό;{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Συνδεθείτε εδώ
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
