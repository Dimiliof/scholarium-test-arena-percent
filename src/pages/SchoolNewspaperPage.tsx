
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchoolNews } from '@/hooks/useSchoolNews';
import { Newspaper, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsFilter from '@/components/school-newspaper/NewsFilter';
import NewsArticlesList from '@/components/school-newspaper/NewsArticlesList';

const SchoolNewspaperPage: React.FC = () => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const { 
    articles, 
    loading, 
    selectedCategory, 
    searchQuery, 
    setSelectedCategory, 
    setSearchQuery, 
    loadArticles,
    formatDate
  } = useSchoolNews();

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleCreateArticle = () => {
    navigate('/school-newspaper/create');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Newspaper className="h-8 w-8 mr-2 text-primary" />
                Σχολική Εφημερίδα
              </h1>
              <p className="text-muted-foreground">
                Ενημερωθείτε για τα τελευταία νέα και τις εκδηλώσεις του σχολείου μας
              </p>
            </div>
            
            {isAuthenticated && (isTeacher || isAdmin) && (
              <Button onClick={handleCreateArticle} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Νέο Άρθρο
              </Button>
            )}
          </div>
          
          <NewsFilter 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <NewsArticlesList 
            articles={articles}
            loading={loading}
            formatDate={formatDate}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchoolNewspaperPage;
