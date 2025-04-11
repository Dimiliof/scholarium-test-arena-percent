
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchoolNews, type NewsArticle } from '@/hooks/useSchoolNews';
import { Calendar, User, Tag, ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categoryLabels = {
  events: 'Εκδηλώσεις',
  announcements: 'Ανακοινώσεις',
  achievements: 'Επιτεύγματα',
  general: 'Γενικά'
};

const categoryColors = {
  events: 'bg-blue-100 text-blue-800',
  announcements: 'bg-amber-100 text-amber-800',
  achievements: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800'
};

const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const { articles, deleteArticle, formatDate } = useSchoolNews();
  const [article, setArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    if (articleId) {
      const foundArticle = articles.find(a => a.id === articleId);
      if (foundArticle) {
        setArticle(foundArticle);
        // Set page title to article title
        document.title = `${foundArticle.title} | Σχολική Εφημερίδα`;
      } else {
        navigate('/school-newspaper');
      }
    }
    
    // Reset title when component unmounts
    return () => {
      document.title = 'Σχολική Εφημερίδα | Εκπαιδευτήρια Ατσόγλου';
    };
  }, [articleId, articles, navigate]);

  const handleBackClick = () => {
    navigate('/school-newspaper');
  };

  const handleEditArticle = () => {
    navigate(`/school-newspaper/edit/${articleId}`);
  };

  const handleDeleteArticle = () => {
    if (articleId) {
      deleteArticle(articleId);
      navigate('/school-newspaper');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColor = categoryColors[article.category] || categoryColors.general;
  const categoryLabel = categoryLabels[article.category] || categoryLabels.general;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Button variant="outline" onClick={handleBackClick} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Επιστροφή στην Εφημερίδα
          </Button>
          
          <article className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={categoryColor}>
                    <Tag className="h-3 w-3 mr-1" />
                    {categoryLabel}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(article.date)}
                  <span className="mx-2">•</span>
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
              </div>
              
              {isAuthenticated && (isTeacher || isAdmin) && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" onClick={handleEditArticle}>
                    <Edit className="h-4 w-4 mr-2" />
                    Επεξεργασία
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Διαγραφή
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                        <AlertDialogDescription>
                          Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Το άρθρο θα διαγραφεί μόνιμα.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteArticle} className="bg-destructive text-destructive-foreground">
                          Διαγραφή
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            
            {article.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden max-h-[32rem]">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-contain" 
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl font-medium mb-6 text-gray-700">{article.summary}</p>
              <div className="whitespace-pre-line text-gray-800">
                {article.content.split('\n').map((paragraph, i) => (
                  <p key={i} className={i === 0 ? "mt-0" : "mt-6"}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
          
          {/* Add a "Back to News" button at the bottom for easier navigation */}
          <div className="flex justify-center mb-8">
            <Button onClick={handleBackClick} variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Πίσω στα Άρθρα
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
