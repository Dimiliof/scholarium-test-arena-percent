
import React from 'react';
import { Bell, Calendar, Award, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewsFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const categories = [
  { id: null, name: 'Όλα', icon: FileText },
  { id: 'announcements', name: 'Ανακοινώσεις', icon: Bell },
  { id: 'events', name: 'Εκδηλώσεις', icon: Calendar },
  { id: 'achievements', name: 'Επιτεύγματα', icon: Award }
];

const NewsFilter: React.FC<NewsFilterProps> = ({ 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2 relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση άρθρων..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id || 'all'}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-1"
            >
              <Icon className="h-4 w-4 mr-1" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFilter;
