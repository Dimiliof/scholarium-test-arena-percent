
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
  email: z.string().email({
    message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email.",
  }),
  password: z.string().min(8, {
    message: "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  }),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Login attempt:", values);
      
      // Successful login toast
      toast({
        title: "Επιτυχής σύνδεση",
        description: "Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά.",
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Σφάλμα σύνδεσης",
        description: "Παρουσιάστηκε σφάλμα κατά τη σύνδεση. Παρακαλώ προσπαθήστε ξανά.",
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
              <CardTitle className="text-2xl font-bold">Είσοδος</CardTitle>
              <CardDescription>
                Εισάγετε τα στοιχεία σας για να συνδεθείτε
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    {isLoading ? "Σύνδεση..." : "Σύνδεση"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm">
                <p>
                  Δεν έχετε λογαριασμό;{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Εγγραφείτε εδώ
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

export default LoginPage;
