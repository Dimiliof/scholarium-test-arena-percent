
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Ο τρέχων κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες",
  }),
  newPassword: z.string().min(8, {
    message: "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες",
  }),
  confirmPassword: z.string().min(8, {
    message: "Η επιβεβαίωση κωδικού πρέπει να έχει τουλάχιστον 8 χαρακτήρες",
  }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Οι κωδικοί δεν ταιριάζουν",
  path: ["confirmPassword"],
});

const ChangePasswordPage = () => {
  const { user, isAuthenticated, changePassword } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Υλοποίηση αλλαγής κωδικού
      const success = await changePassword(values.currentPassword, values.newPassword);
      
      if (success) {
        uiToast({
          title: "Επιτυχής ενημέρωση",
          description: "Ο κωδικός σας άλλαξε με επιτυχία.",
        });
        
        toast.success("Ο κωδικός άλλαξε με επιτυχία");
        
        // Ανακατεύθυνση στη σελίδα προφίλ
        navigate("/profile");
      } else {
        uiToast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Ο τρέχων κωδικός είναι λάθος ή προέκυψε σφάλμα.",
        });
        
        toast.error("Σφάλμα κατά την αλλαγή κωδικού");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την αλλαγή κωδικού:", error);
      toast.error("Παρουσιάστηκε σφάλμα κατά την αλλαγή κωδικού");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Επιστροφή στο προφίλ
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Αλλαγή Κωδικού</CardTitle>
              <CardDescription>
                Εισάγετε τον τρέχοντα κωδικό σας και τον νέο κωδικό που επιθυμείτε
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Τρέχων Κωδικός</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Νέος Κωδικός</FormLabel>
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
                        <FormLabel>Επιβεβαίωση Νέου Κωδικού</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Αποθήκευση...
                        </>
                      ) : (
                        "Αλλαγή Κωδικού"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
