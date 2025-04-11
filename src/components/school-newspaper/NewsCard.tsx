
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, BookOpen } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type NewsArticle } from '@/hooks/useSchoolNews';

interface NewsCardProps {
  article: NewsArticle;
  formatDate: (date: string) => string;
}

const categoryColors = {
  events: 'bg-blue-100 text-blue-800',
  announcements: 'bg-amber-100 text-amber-800',
  achievements: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800'
};

const categoryLabels = {
  events: 'Εκδηλώσεις',
  announcements: 'Ανακοινώσεις',
  achievements: 'Επιτεύγματα',
  general: 'Γενικά'
};

const NewsCard: React.FC<NewsCardProps> = ({ article, formatDate }) => {
  const navigate = useNavigate();
  
  const handleReadMore = () => {
    navigate(`/school-newspaper/${article.id}`);
  };
  
  const categoryColor = categoryColors[article.category] || categoryColors.general;
  const categoryLabel = categoryLabels[article.category] || categoryLabels.general;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      <CardHeader className="flex-grow-0">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={categoryColor}>
            <Tag className="h-3 w-3 mr-1" />
            {categoryLabel}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{article.title}</CardTitle>
        <CardDescription className="flex items-center text-sm mt-2">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {formatDate(article.date)}
          <span className="mx-2">•</span>
          <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {article.author}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{article.summary}</p>
      </CardContent>
      
      <CardFooter className="flex-grow-0 pt-0">
        <Button variant="outline" onClick={handleReadMore} className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Διαβάστε Περισσότερα
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
