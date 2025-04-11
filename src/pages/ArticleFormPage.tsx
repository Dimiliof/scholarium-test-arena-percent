
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchoolNews, type NewsArticle } from '@/hooks/useSchoolNews';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 5 χαρακτήρες',
  }),
  summary: z.string().min(10, {
    message: 'Η περίληψη πρέπει να έχει τουλάχιστον 10 χαρακτήρες',
  }),
  content: z.string().min(50, {
    message: 'Το περιεχόμενο πρέπει να έχει τουλάχιστον 50 χαρακτήρες',
  }),
  author: z.string().min(2, {
    message: 'Ο συγγραφέας πρέπει να έχει τουλάχιστον 2 χαρακτήρες',
  }),
  imageUrl: z.string().url({ message: 'Παρακαλώ εισάγετε έγκυρο URL εικόνας' }).optional().or(z.literal('')),
  category: z.enum(['events', 'announcements', 'achievements', 'general']),
});

type FormValues = z.infer<typeof formSchema>;

const ArticleFormPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher, isAdmin, user } = useAuth();
  const { articles, createArticle } = useSchoolNews();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      author: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.email || '',
      imageUrl: '',
      category: 'general',
    },
  });

  useEffect(() => {
    // Redirect if not authenticated or not a teacher/admin
    if (!isAuthenticated || (!isTeacher && !isAdmin)) {
      navigate('/login');
      return;
    }

    // Check if we're editing an existing article
    if (articleId) {
      const articleToEdit = articles.find(a => a.id === articleId);
      if (articleToEdit) {
        setIsEditing(true);
        // Set form values from existing article
        form.reset({
          title: articleToEdit.title,
          summary: articleToEdit.summary,
          content: articleToEdit.content,
          author: articleToEdit.author,
          imageUrl: articleToEdit.imageUrl || '',
          category: articleToEdit.category,
        });
      } else {
        // Article not found, redirect to the newspaper page
        navigate('/school-newspaper');
      }
    }
  }, [articleId, articles, form, isAuthenticated, isAdmin, isTeacher, navigate, user]);

  const onSubmit = (values: FormValues) => {
    // Create a new article
    createArticle({
      title: values.title,
      summary: values.summary,
      content: values.content,
      author: values.author,
      imageUrl: values.imageUrl || undefined,
      category: values.category,
    });

    // Navigate back to the newspaper page
    navigate('/school-newspaper');
  };

  const handleBackClick = () => {
    navigate('/school-newspaper');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="outline" onClick={handleBackClick} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Επιστροφή στην Εφημερίδα
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Επεξεργασία Άρθρου' : 'Δημιουργία Νέου Άρθρου'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing 
                ? 'Επεξεργαστείτε τις πληροφορίες του άρθρου' 
                : 'Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε ένα νέο άρθρο'}
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τίτλος</FormLabel>
                      <FormControl>
                        <Input placeholder="Εισάγετε τον τίτλο του άρθρου" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ο τίτλος του άρθρου που θα εμφανίζεται στην εφημερίδα.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Περίληψη</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Γράψτε μια σύντομη περίληψη του άρθρου" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Μια σύντομη περίληψη που θα εμφανίζεται στην κάρτα του άρθρου.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Περιεχόμενο</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Γράψτε το πλήρες περιεχόμενο του άρθρου" 
                          {...field} 
                          rows={10}
                        />
                      </FormControl>
                      <FormDescription>
                        Το πλήρες κείμενο του άρθρου. Μπορείτε να χρησιμοποιήσετε αλλαγές γραμμής για παραγράφους.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Συγγραφέας</FormLabel>
                        <FormControl>
                          <Input placeholder="Όνομα συγγραφέα ή τμήματος" {...field} />
                        </FormControl>
                        <FormDescription>
                          Το όνομα του συγγραφέα ή του τμήματος που έγραψε το άρθρο.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Κατηγορία</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Επιλέξτε κατηγορία" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="announcements">Ανακοινώσεις</SelectItem>
                            <SelectItem value="events">Εκδηλώσεις</SelectItem>
                            <SelectItem value="achievements">Επιτεύγματα</SelectItem>
                            <SelectItem value="general">Γενικά</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Η κατηγορία στην οποία ανήκει το άρθρο.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Εικόνας (Προαιρετικό)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Εισάγετε το URL μιας εικόνας που θα συνοδεύει το άρθρο.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {isEditing ? 'Αποθήκευση Αλλαγών' : 'Δημοσίευση Άρθρου'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleFormPage;
