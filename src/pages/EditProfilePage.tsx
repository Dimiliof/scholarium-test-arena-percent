
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, User, Upload, Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες",
  }),
  lastName: z.string().min(2, {
    message: "Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες",
  }),
  email: z.string().email({
    message: "Παρακαλώ εισάγετε έγκυρη διεύθυνση email",
  }),
});

const EditProfilePage = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    // Ενημέρωση της φόρμας όταν φορτώνονται τα δεδομένα του χρήστη
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      
      // Αν ο χρήστης έχει ήδη φωτογραφία προφίλ, τη φορτώνουμε
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Η εικόνα που θα αποθηκευτεί είναι είτε η νέα είτε η υπάρχουσα
      const imageToSave = previewImage || profileImage;
      
      // Καλούμε τη συνάρτηση ενημέρωσης του προφίλ
      const updatedUser = {
        ...user,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        profileImage: imageToSave
      };
      
      await updateUserProfile(updatedUser);
      
      uiToast({
        title: "Επιτυχής ενημέρωση",
        description: "Τα στοιχεία του προφίλ σας ενημερώθηκαν με επιτυχία.",
      });
      
      toast.success("Το προφίλ ενημερώθηκε με επιτυχία");
      
      // Ανακατεύθυνση στη σελίδα προφίλ
      navigate("/profile");
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του προφίλ:", error);
      toast.error("Παρουσιάστηκε σφάλμα κατά την ενημέρωση του προφίλ");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
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
              <CardTitle>Επεξεργασία Προφίλ</CardTitle>
              <CardDescription>
                Ενημερώστε τα προσωπικά σας στοιχεία και τη φωτογραφία προφίλ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  {previewImage ? (
                    <AvatarImage src={previewImage} alt="Προεπισκόπηση" />
                  ) : profileImage ? (
                    <AvatarImage src={profileImage} alt={user.firstName} />
                  ) : (
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <Label 
                  htmlFor="profile-image" 
                  className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Αλλαγή φωτογραφίας
                </Label>
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {previewImage && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setPreviewImage(null)}
                  >
                    Ακύρωση
                  </Button>
                )}
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Όνομα</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input type="email" {...field} />
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
                        "Αποθήκευση αλλαγών"
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

export default EditProfilePage;
