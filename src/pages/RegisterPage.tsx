
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

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
    setRegisterError(null);
    
    try {
      const success = await registerUser(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
      
      if (success) {
        uiToast({
          title: "Επιτυχής εγγραφή",
          description: "Ο λογαριασμός σας δημιουργήθηκε επιτυχώς. Είστε τώρα συνδεδεμένοι.",
        });
        navigate("/");
      } else {
        setRegisterError("Το email που εισάγατε χρησιμοποιείται ήδη. Παρακαλώ χρησιμοποιήστε ένα διαφορετικό email.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("Παρουσιάστηκε σφάλμα κατά την εγγραφή. Παρακαλώ προσπαθήστε ξανά.");
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
              {registerError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Σφάλμα</AlertTitle>
                  <AlertDescription>
                    {registerError}
                  </AlertDescription>
                </Alert>
              )}
              
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
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Εγγραφή...
                      </>
                    ) : (
                      "Εγγραφή"
                    )}
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
