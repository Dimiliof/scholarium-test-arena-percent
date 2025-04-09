
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email.",
  }),
  password: z.string().min(8, {
    message: "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  }),
});

type LoginFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
};

const LoginForm = ({ onSubmit, isLoading, loginError }: LoginFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <>
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
    </>
  );
};

export default LoginForm;
