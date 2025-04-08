
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ThumbsUp, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock forum data - in a real app this would come from an API
const mockForumData = {
  'mathematics': [
    {
      id: 1,
      title: 'Βοήθεια με ολοκληρώματα',
      author: 'Μαρία Π.',
      date: '2025-04-01',
      content: 'Έχω δυσκολία στην κατανόηση των ολοκληρωμάτων. Μπορεί κάποιος να μου εξηγήσει τα βασικά βήματα;',
      subjectId: 'mathematics',
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
      subjectId: 'mathematics',
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
      subjectId: 'physics',
      replies: []
    }
  ],
  'chemistry': [
    {
      id: 4,
      title: 'Ερώτηση για χημικές αντιδράσεις',
      author: 'Ελένη Μ.',
      date: '2025-04-06',
      content: 'Πώς μπορώ να καταλάβω πότε μια χημική αντίδραση είναι εξώθερμη ή ενδόθερμη;',
      subjectId: 'chemistry',
      replies: []
    }
  ],
  'biology': [
    {
      id: 5,
      title: 'Κύτταρο και λειτουργίες',
      author: 'Κώστας Λ.',
      date: '2025-04-07',
      content: 'Μπορεί κάποιος να μου εξηγήσει τις βασικές λειτουργίες του κυττάρου;',
      subjectId: 'biology',
      replies: []
    }
  ],
  'literature': [
    {
      id: 6,
      title: 'Ανάλυση ποιήματος Καβάφη',
      author: 'Αναστασία Κ.',
      date: '2025-04-08',
      content: 'Θα ήθελα βοήθεια στην ανάλυση του ποιήματος "Ιθάκη" του Καβάφη.',
      subjectId: 'literature',
      replies: []
    }
  ]
};

// Flatten posts for easier lookup
const allPosts = Object.values(mockForumData).flat();

const ForumPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();
  
  const post = allPosts.find(p => p.id === Number(postId));
  
  const handleSubmitReply = () => {
    if (replyContent.trim().length === 0) return;
    
    // In a real app, we would send this to an API
    toast({
      title: "Η απάντηση καταχωρήθηκε",
      description: "Η απάντησή σας δημοσιεύτηκε με επιτυχία",
    });
    
    setReplyContent('');
  };
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Η ανάρτηση δεν βρέθηκε</h1>
          <Link to="/forum">
            <Button>Επιστροφή στο φόρουμ</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/forum/${post.subjectId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Επιστροφή στο φόρουμ
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="bg-muted/30">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('el-GR')}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {post.author}
            </div>
          </CardHeader>
          <CardContent className="pt-6 text-lg">
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter className="bg-muted/20 flex justify-between items-center border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> {post.replies.length} απαντήσεις
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" /> Χρήσιμο
            </Button>
          </CardFooter>
        </Card>
        
        <h2 className="text-xl font-semibold mb-6">Απαντήσεις</h2>
        
        {post.replies.length > 0 ? (
          <div className="space-y-6 mb-8">
            {post.replies.map((reply) => (
              <Card key={reply.id} className="border-l-4 border-l-primary">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{reply.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{reply.author}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(reply.date).toLocaleDateString('el-GR')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="whitespace-pre-line">{reply.content}</p>
                </CardContent>
                <CardFooter className="justify-end border-t pt-3">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" /> Χρήσιμο
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/20 mb-8">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Δεν υπάρχουν απαντήσεις ακόμα. Γίνετε ο πρώτος που θα απαντήσει!</p>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Η απάντησή σας</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Γράψτε την απάντησή σας εδώ..." 
              className="min-h-[150px] mb-4"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitReply} disabled={replyContent.trim().length === 0}>
                Υποβολή απάντησης
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForumPostPage;
