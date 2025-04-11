
import React from 'react';
import { type NewsArticle } from '@/hooks/useSchoolNews';
import NewsCard from './NewsCard';
import { FileWarning } from 'lucide-react';

interface NewsArticlesListProps {
  articles: NewsArticle[];
  loading: boolean;
  formatDate: (date: string) => string;
}

const NewsArticlesList: React.FC<NewsArticlesListProps> = ({ 
  articles, 
  loading, 
  formatDate 
}) => {
  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Φόρτωση άρθρων...</p>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FileWarning className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">Δεν βρέθηκαν άρθρα</h3>
        <p className="text-muted-foreground">
          Δεν υπάρχουν άρθρα που να ταιριάζουν με τα κριτήρια αναζήτησης.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard 
          key={article.id}
          article={article}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default NewsArticlesList;
