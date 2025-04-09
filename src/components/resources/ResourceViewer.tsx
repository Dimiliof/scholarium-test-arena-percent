
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestionManagement, ResourceType } from '@/hooks/useQuestionManagement';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Copy, Download, ExternalLink, AlertTriangle, Lock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { subjects } from '@/lib/subjectsData';
import { toast } from 'sonner';

const responseSchema = z.object({
  studentName: z.string().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες"),
  response: z.string().min(1, "Η απάντηση δεν μπορεί να είναι κενή"),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

const ResourceViewer: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { getResourceById, addResourceResponse } = useQuestionManagement();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Φορτώνουμε τον πόρο
  const resource = resourceId ? getResourceById(resourceId) : undefined;
  
  useEffect(() => {
    // Απλό timeout για να δείξουμε το loading
    const timer = setTimeout(() => {
      setLoading(false);
      
      if (resourceId && !resource) {
        setError("Ο πόρος που ζητήθηκε δεν βρέθηκε ή δεν είναι διαθέσιμος.");
      } else if (resource && !resource.isPublic && (!isAuthenticated || (user?.email !== resource.authorEmail))) {
        setError("Αυτός ο πόρος είναι ιδιωτικός και δεν έχετε πρόσβαση σε αυτόν.");
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [resourceId, resource, isAuthenticated, user]);
  
  if (!resourceId) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Σφάλμα</CardTitle>
            <CardDescription className="text-center">
              Δεν βρέθηκε ο αναγνωριστικός κωδικός πόρου
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/resources')}>
              Επιστροφή στους Πόρους
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
              <p className="text-lg">Φόρτωση πόρου...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !resource) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              {error?.includes("ιδιωτικός") ? (
                <Lock className="h-16 w-16 text-orange-500" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-center text-xl">
              {error?.includes("ιδιωτικός") ? "Περιορισμένη Πρόσβαση" : "Πόρος Δεν Βρέθηκε"}
            </CardTitle>
            <CardDescription className="text-center mt-2">
              {error || "Ο πόρος που ζητήσατε δεν υπάρχει ή έχει αφαιρεθεί"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-4">
            <Button onClick={() => navigate('/resources')}>
              Επιστροφή στους Πόρους
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      studentName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      response: ''
    }
  });
  
  const subject = subjects.find(s => s.id === resource.subject);
  
  const handleCopyLink = () => {
    const shareableLink = window.location.href;
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast.success("Ο σύνδεσμος αντιγράφηκε στο πρόχειρο");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const onSubmit = (data: ResponseFormValues) => {
    addResourceResponse(resourceId, data);
    form.reset();
  };
  
  const increaseDownloadCount = () => {
    // Θα μπορούσαμε να προσθέσουμε κώδικα για την καταμέτρηση των λήψεων
    // αλλά αυτό είναι ένα μελλοντικό χαρακτηριστικό
  };
  
  const renderResourceContent = () => {
    switch (resource.type) {
      case 'pdf':
        return (
          <div className="w-full max-h-[800px] overflow-auto border rounded">
            <iframe 
              src={resource.url} 
              className="w-full h-[700px]" 
              title={resource.title}
            ></iframe>
          </div>
        );
      case 'link':
      case 'development':
        return (
          <div className="text-center py-6">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Άνοιγμα συνδέσμου σε νέο παράθυρο
            </a>
          </div>
        );
      case 'video':
        if (resource.url.includes('youtube') || resource.url.includes('youtu.be')) {
          const videoId = resource.url.includes('youtu.be') 
            ? resource.url.split('youtu.be/')[1]
            : resource.url.split('v=')[1]?.split('&')[0];
          
          return (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                title={resource.title}
                allowFullScreen
              ></iframe>
            </div>
          );
        } else {
          return (
            <div className="aspect-video w-full">
              <video 
                src={resource.url} 
                controls 
                className="w-full h-full"
              ></video>
            </div>
          );
        }
      default:
        return (
          <div className="text-center py-6">
            <a 
              href={resource.url} 
              download
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              onClick={increaseDownloadCount}
            >
              <Download className="h-4 w-4" />
              Κάντε κλικ για λήψη του αρχείου
            </a>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {!resource.isPublic && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Ιδιωτικός πόρος</AlertTitle>
          <AlertDescription>
            Αυτό το περιεχόμενο είναι ορατό μόνο σε εσάς ως δημιουργό του. Οι μαθητές και άλλοι εκπαιδευτικοί δεν μπορούν να το δουν.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
            <div>
              <CardTitle className="text-2xl">{resource.title}</CardTitle>
              <CardDescription>
                {subject?.name || 'Γενικό'} • {resource.dateAdded}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Αντιγράφηκε!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Αντιγραφή Συνδέσμου
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded">
            <h3 className="font-medium mb-2">Περιγραφή</h3>
            <p className="whitespace-pre-line">{resource.description}</p>
          </div>
          
          {renderResourceContent()}
          
          <div className="border-t pt-4 mt-8">
            <h3 className="font-medium text-lg mb-4">Αποστολή Απάντησης</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ονοματεπώνυμο</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Πλήρες όνομα" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Η απάντησή σας</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Γράψτε την απάντησή σας εδώ..." 
                          className="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Υποβολή Απάντησης</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/resources')}>
          Επιστροφή στους Πόρους
        </Button>
        
        {resource.type !== 'link' && resource.type !== 'development' && (
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a href={resource.url} download onClick={increaseDownloadCount}>
              <Download className="h-4 w-4" />
              Λήψη
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResourceViewer;
