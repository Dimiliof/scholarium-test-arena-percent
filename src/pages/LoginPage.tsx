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
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email.",
  }),
  password: z.string().min(8, {
    message: "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  }),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const { login, makeUserTeacherAndAdmin, isTeacher, isAdmin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Έλεγχος για τον κύριο διαχειριστή (απευθείας αναγνώριση)
      if (values.email === "liofisdimitris@gmail.com" && values.password === "Skatadi21!") {
        console.log("Εντοπίστηκε ο κύριος διαχειριστής - απευθείας είσοδος");
        
        // Διόρθωση των δικαιωμάτων του διαχειριστή
        await makeUserTeacherAndAdmin(values.email);
        
        // Δημιουργία του αντικειμένου χρήστη για την τοπική αποθήκευση
        const adminUser = {
          id: "admin-special-id",
          firstName: "Διαχειριστής",
          lastName: "Συστήματος",
          email: values.email,
          role: "admin",
          roles: ["admin", "teacher"]
        };
        
        // Αποθήκευση στο localStorage
        localStorage.setItem("user", JSON.stringify(adminUser));
        
        // Ειδοποίηση και ανακατεύθυνση
        uiToast({
          title: "Επιτυχής σύνδεση",
          description: "Καλωσήρθατε, Διαχειριστή.",
        });
        
        toast.success("Συνδεθήκατε ως Διαχειριστής");
        
        // Κατευθύνουμε τον διαχειριστή στον πίνακα ελέγχου
        navigate("/admin/users");
        setIsLoading(false);
        return;
      }
      
      // Κανονική ροή σύνδεσης για άλλους χρήστες
      const success = await login(values.email, values.password);
      
      if (success) {
        // Παίρνουμε το χρήστη από το localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // Διπλός έλεγχος για τα δικαιώματα
          const isUserAdmin = user.role === "admin" || (user.roles && user.roles.includes("admin"));
          const isUserTeacher = user.role === "teacher" || (user.roles && user.roles.includes("teacher"));
          
          const roleText = isUserAdmin ? "Διαχειριστής" : 
                           isUserTeacher ? "Εκπαιδευτικός" : "Μαθητής";
          
          console.log(`Επιτυχής σύνδεση ως ${roleText} (${user.role})`);
          
          uiToast({
            title: "Επιτυχής σύνδεση",
            description: `Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά. Συνδεθήκατε ως ${roleText}.`,
          });
          
          toast.success(`Συνδεθήκατε ως ${roleText}`);
          
          // Κατεύθυνση χρήστη ανάλογα με τον ρόλο
          if (isUserAdmin) {
            navigate("/admin/users");
          } else if (isUserTeacher) {
            navigate("/teacher-dashboard");
          } else {
            navigate("/student/courses");
          }
        } else {
          uiToast({
            title: "Επιτυχής σύνδεση",
            description: "Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά.",
          });
          navigate("/");
        }
      } else {
        setLoginError("Λάθος email ή κωδικός πρόσβασης. Παρακαλώ προσπαθήστε ξανά.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Παρουσιάστηκε σφάλμα κατά τη σύνδεση. Παρακαλώ προσπαθήστε ξανά.");
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
              <CardTitle className="text-2xl font-bold">Είσοδος</CardTitle>
              <CardDescription>
                Εισάγετε τα στοιχεία σας για να συνδεθείτε
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Σφάλμα</AlertTitle>
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Σύνδεση...
                      </>
                    ) : (
                      "Σύνδεση"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm">
                <p>
                  Δεν έχετε λογαριασμό;{" "}
                  <Link to="/register-type" className="text-primary hover:underline">
                    Εγγραφείτε εδώ
                  </Link>
                </p>
              </div>
              
              <div className="mt-6 border-t pt-4 text-center">
                <h3 className="text-sm font-semibold mb-2">Χρειάζεστε βοήθεια;</h3>
                <div className="flex justify-center text-muted-foreground">
                  <a 
                    href="mailto:it-support@atsoglou.gr" 
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Υποστήριξη Email</span>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Επικοινωνήστε με την τεχνική υποστήριξη για άμεση βοήθεια
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

export default LoginPage;
