
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, PlusCircle, MessageCircle, MessageSquare, MessagesSquare } from 'lucide-react';
import ForumPostList from '@/components/forum/ForumPostList';
import NewPostForm from '@/components/forum/NewPostForm';
import { subjects } from '@/lib/subjectsData';
import { useToast } from '@/hooks/use-toast';

// Mock forum data
const mockForumData = {
  'mathematics': [
    {
      id: 1,
      title: 'Βοήθεια με ολοκληρώματα',
      author: 'Μαρία Π.',
      date: '2025-04-01',
      content: 'Έχω δυσκολία στην κατανόηση των ολοκληρωμάτων. Μπορεί κάποιος να μου εξηγήσει τα βασικά βήματα;',
      replies: [
        { id: 1, author: 'Καθ. Αντώνης', date: '2025-04-02', content: 'Τα ολοκληρώματα είναι το αντίστροφο της παραγώγισης. Θα σου προτείνω να ξεκινήσεις με την κατανόηση αυτής της σχέσης.' },
        { id: 2, author: 'Νίκος Κ.', date: '2025-04-03', content: 'Εγώ βρήκα πολύ βοηθητικά τα βίντεο στην ενότητα "Εκπαιδευτικό Υλικό". Δοκίμασέ τα!' }
      ]
    },
    {
      id: 2,
      title: 'Ερώτηση για συστήματα εξισώσεων',
      author: 'Γιώργος Ν.',
      date: '2025-04-05',
      content: 'Ποια μέθοδος είναι καλύτερη για την επίλυση συστημάτων με 3 αγνώστους;',
      replies: [
        { id: 3, author: 'Καθ. Ελένη', date: '2025-04-05', content: 'Η μέθοδος απαλοιφής Gauss είναι πολύ αποτελεσματική για συστήματα με πολλούς αγνώστους.' }
      ]
    }
  ],
  'physics': [
    {
      id: 3,
      title: 'Απορία σχετικά με τους νόμους του Νεύτωνα',
      author: 'Δημήτρης Α.',
      date: '2025-04-04',
      content: 'Πώς μπορώ να εφαρμόσω το δεύτερο νόμο του Νεύτωνα σε προβλήματα με τριβή;',
      replies: []
    }
  ]
};

interface ForumDiscussionProps {
  subjectId?: string;
}

const ForumDiscussion: React.FC<ForumDiscussionProps> = ({ subjectId }) => {
  const [currentTab, setCurrentTab] = useState('posts');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { toast } = useToast();
  
  const subject = subjectId ? subjects.find(s => s.id === subjectId) : null;
  const posts = subjectId && mockForumData[subjectId as keyof typeof mockForumData] 
    ? mockForumData[subjectId as keyof typeof mockForumData] 
    : [];
  
  const handleSubmitPost = (postData: { title: string; content: string }) => {
    // In a real app, we would send this to an API
    toast({
      title: "Η ανάρτηση δημιουργήθηκε",
      description: "Η ανάρτησή σας δημοσιεύτηκε με επιτυχία",
    });
    setShowNewPostForm(false);
    setCurrentTab('posts');
  };
  
  return (
    <div>
      {subject ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link to={`/subject/${subjectId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Επιστροφή στο μάθημα
              </Link>
              <h1 className="text-3xl font-bold">Φόρουμ συζήτησης: {subject.name}</h1>
            </div>
            
            {!showNewPostForm && (
              <Button 
                onClick={() => setShowNewPostForm(true)} 
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Νέα Ανάρτηση
              </Button>
            )}
          </div>
          
          {showNewPostForm ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Δημιουργία νέας ανάρτησης</CardTitle>
              </CardHeader>
              <CardContent>
                <NewPostForm 
                  onSubmit={handleSubmitPost} 
                  onCancel={() => setShowNewPostForm(false)} 
                />
              </CardContent>
            </Card>
          ) : (
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Όλες οι αναρτήσεις
                </TabsTrigger>
                <TabsTrigger value="my-posts" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Οι αναρτήσεις μου
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="flex items-center gap-2">
                  <MessagesSquare className="h-4 w-4" />
                  Αναπάντητες
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <ForumPostList posts={posts} />
              </TabsContent>
              
              <TabsContent value="my-posts">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Δεν έχετε δημιουργήσει αναρτήσεις ακόμα.</p>
                  <Button onClick={() => setShowNewPostForm(true)}>Δημιουργία ανάρτησης</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="unanswered">
                <ForumPostList posts={posts.filter(post => post.replies.length === 0)} />
              </TabsContent>
            </Tabs>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Φόρουμ συζήτησης</h1>
          <p className="text-muted-foreground mb-6">Παρακαλώ επιλέξτε ένα μάθημα για να δείτε τις συζητήσεις του.</p>
          <Link to="/">
            <Button>Επιστροφή στα μαθήματα</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForumDiscussion;
