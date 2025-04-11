
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Save, Clock } from 'lucide-react';
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
import MediaUploadField from '@/components/school-newspaper/MediaUploadField';
import { toast } from 'sonner';

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
  imageUrl: z.string().optional().or(z.literal('')),
  category: z.enum(['events', 'announcements', 'achievements', 'general']),
});

type FormValues = z.infer<typeof formSchema>;

const DRAFT_STORAGE_KEY = 'article_draft';

const ArticleFormPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher, isAdmin, user } = useAuth();
  const { articles, createArticle } = useSchoolNews();
  const [isEditing, setIsEditing] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

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

  // Αυτόματη αποθήκευση κάθε 30 δευτερόλεπτα
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const interval = setInterval(() => {
      const currentValues = form.getValues();
      
      // Ελέγχουμε αν το form έχει κάποιο περιεχόμενο που αξίζει να αποθηκευτεί
      if (currentValues.title || currentValues.summary || currentValues.content) {
        saveDraft(currentValues);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [form, autoSaveEnabled]);

  // Αποθηκεύει το προσχέδιο στο localStorage
  const saveDraft = (values: FormValues) => {
    try {
      const draft = {
        ...values,
        mediaUrl,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      const now = new Date();
      setLastSaved(now);
    } catch (error) {
      console.error('Σφάλμα κατά την αποθήκευση του προσχεδίου:', error);
    }
  };

  // Φορτώνει το προσχέδιο από το localStorage
  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        form.reset({
          title: draft.title || '',
          summary: draft.summary || '',
          content: draft.content || '',
          author: draft.author || '',
          imageUrl: draft.mediaUrl || '',
          category: draft.category || 'general',
        });
        
        if (draft.mediaUrl) {
          setMediaUrl(draft.mediaUrl);
        }
        
        if (draft.lastSaved) {
          setLastSaved(new Date(draft.lastSaved));
        }
        
        toast.success('Το προσχέδιο φορτώθηκε επιτυχώς');
      }
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση του προσχεδίου:', error);
      toast.error('Παρουσιάστηκε πρόβλημα κατά τη φόρτωση του προσχεδίου');
    }
  };

  // Διαγράφει το προσχέδιο από το localStorage
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setLastSaved(null);
      toast.success('Το προσχέδιο διαγράφηκε επιτυχώς');
    } catch (error) {
      console.error('Σφάλμα κατά τη διαγραφή του προσχεδίου:', error);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated or not a teacher/admin
    if (!isAuthenticated || (!isTeacher && !isAdmin)) {
      navigate('/login');
      return;
    }

    // Check if we're editing an existing article
    if (articleId) {
      setAutoSaveEnabled(false); // Απενεργοποίηση αυτόματης αποθήκευσης σε λειτουργία επεξεργασίας
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
        
        if (articleToEdit.imageUrl) {
          setMediaUrl(articleToEdit.imageUrl);
        }
      } else {
        // Article not found, redirect to the newspaper page
        navigate('/school-newspaper');
      }
    } else {
      // Σε λειτουργία δημιουργίας νέου άρθρου, έλεγχος για προσχέδιο
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        // Υπάρχει αποθηκευμένο προσχέδιο - ρωτάμε τον χρήστη αν θέλει να το φορτώσει
        toast("Βρέθηκε αποθηκευμένο προσχέδιο", {
          description: "Θέλετε να συνεχίσετε από εκεί που σταματήσατε;",
          action: {
            label: "Φόρτωση",
            onClick: () => loadDraft()
          },
          cancel: {
            label: "Νέο Άρθρο",
            onClick: () => clearDraft()
          },
          duration: 10000,
        });
      }
    }
  }, [articleId, articles, form, isAuthenticated, isAdmin, isTeacher, navigate, user]);

  const onSubmit = (values: FormValues) => {
    // Δημιουργία νέου άρθρου
    try {
      createArticle({
        title: values.title,
        summary: values.summary,
        content: values.content,
        author: values.author,
        imageUrl: mediaUrl || undefined,
        category: values.category,
      });

      // Καθαρισμός του προσχεδίου μετά την επιτυχή δημοσίευση
      clearDraft();
      
      // Μετάβαση πίσω στη σελίδα της εφημερίδας
      navigate('/school-newspaper');
    } catch (error) {
      console.error('Σφάλμα κατά τη δημιουργία του άρθρου:', error);
      toast.error('Υπήρξε ένα πρόβλημα κατά την αποθήκευση του άρθρου.');
    }
  };

  // Χειροκίνητη αποθήκευση προσχεδίου
  const handleSaveDraft = () => {
    const currentValues = form.getValues();
    saveDraft(currentValues);
    toast.success('Το προσχέδιο αποθηκεύτηκε επιτυχώς');
  };

  const handleMediaUpload = (url: string) => {
    setMediaUrl(url);
  };

  const handleBackClick = () => {
    // Ελέγχουμε αν υπάρχουν μη αποθηκευμένες αλλαγές
    const currentValues = form.getValues();
    if ((currentValues.title || currentValues.summary || currentValues.content) && autoSaveEnabled) {
      // Ρωτάμε τον χρήστη αν θέλει να αποθηκεύσει τις αλλαγές του
      toast("Έχετε μη αποθηκευμένες αλλαγές", {
        description: "Θέλετε να αποθηκεύσετε το προσχέδιο πριν φύγετε;",
        action: {
          label: "Αποθήκευση & Έξοδος",
          onClick: () => {
            saveDraft(currentValues);
            navigate('/school-newspaper');
          }
        },
        cancel: {
          label: "Έξοδος",
          onClick: () => {
            navigate('/school-newspaper');
          }
        },
        duration: 10000,
      });
    } else {
      navigate('/school-newspaper');
    }
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
          
          {!isEditing && autoSaveEnabled && (
            <div className="bg-muted p-4 rounded-lg mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {lastSaved ? (
                  <span>Τελευταία αποθήκευση: {lastSaved.toLocaleTimeString('el-GR')}</span>
                ) : (
                  <span>Αυτόματη αποθήκευση ενεργή</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                >
                  Αποθήκευση Προσχεδίου
                </Button>
              </div>
            </div>
          )}
          
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
                
                {/* Προσθήκη του component για ανέβασμα πολυμέσων */}
                <MediaUploadField form={form} onMediaUpload={handleMediaUpload} />
                
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
                
                <div className="flex justify-end gap-2">
                  {!isEditing && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Αποθήκευση Προσχεδίου
                    </Button>
                  )}
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
