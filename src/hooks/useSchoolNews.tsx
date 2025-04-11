
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  category: 'events' | 'announcements' | 'achievements' | 'general';
}

export const useSchoolNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadArticles = useCallback(() => {
    setLoading(true);
    
    // Προσομοίωση φόρτωσης από API - θα αντικατασταθεί με πραγματικό API call μελλοντικά
    setTimeout(() => {
      try {
        const savedArticles = localStorage.getItem('school_news_articles');
        
        if (savedArticles) {
          setArticles(JSON.parse(savedArticles));
        } else {
          // Δημιουργία δοκιμαστικών άρθρων αν δεν υπάρχουν αποθηκευμένα
          const defaultArticles: NewsArticle[] = [
            {
              id: '6',
              title: 'EDUCATION LEADER AWARDS 2024',
              summary: 'Η βάση της φιλοσοφίας που διέπει το σχολείο μας θεμελιώνεται από έναν σαφή κοινωνικό προσανατολισμό.',
              content: `Με μεγάλη χαρά και υπερηφάνεια, τα Εκπαιδευτήρια Ατσόγλου έλαβαν μέρος στα Education Leader Awards 2024 που πραγματοποιήθηκαν στις 11 Απριλίου 2025.\n\nΗ βάση της φιλοσοφίας που διέπει το σχολείο μας θεμελιώνεται από έναν σαφή κοινωνικό προσανατολισμό, στοχεύοντας στη διαμόρφωση ολοκληρωμένων προσωπικοτήτων με κριτική σκέψη και κοινωνική συνείδηση.\n\nΣτην εκδήλωση απονομής των βραβείων, εκπροσωπήθηκε το σχολείο μας από τη Διευθύντρια και τη Διαχειρίστρια του Συστήματος Ποιότητας, οι οποίες παρέλαβαν το βραβείο που αποτελεί αναγνώριση της συνεχούς προσπάθειάς μας για καινοτομία και αριστεία στην εκπαίδευση.\n\nΤα Education Leader Awards αναγνωρίζουν και επιβραβεύουν τις βέλτιστες πρακτικές στην εκπαίδευση και την καινοτομία στις εκπαιδευτικές μεθόδους, υποστηρίζοντας τη διάδοση της γνώσης και τη συνεχή βελτίωση της παιδείας στη χώρα μας. Είμαστε περήφανοι που αποτελούμε μέρος αυτής της προσπάθειας και δεσμευόμαστε να συνεχίσουμε το έργο μας με το ίδιο πάθος και αφοσίωση.`,
              author: 'Διεύθυνση Σχολείου',
              date: '2025-04-12',
              imageUrl: '/lovable-uploads/d0a5661e-5c93-4964-aee7-665b35cb1e36.png',
              category: 'achievements'
            },
            {
              id: '1',
              title: 'Διεξαγωγή Μαθητικού Διαγωνισμού Μαθηματικών',
              summary: 'Διαγωνισμός μαθηματικών για όλους τους μαθητές Γυμνασίου και Λυκείου.',
              content: 'Ο διαγωνισμός θα πραγματοποιηθεί στις 15 Μαΐου στην αίθουσα εκδηλώσεων του σχολείου. Οι μαθητές πρέπει να δηλώσουν συμμετοχή μέχρι τις 10 Μαΐου. Σε όλους τους συμμετέχοντες θα δοθούν βεβαιώσεις συμμετοχής, ενώ οι πρώτοι τρεις νικητές θα λάβουν έπαινο και βιβλία μαθηματικών.',
              author: 'Τμήμα Μαθηματικών',
              date: '2025-04-05',
              category: 'events'
            },
            {
              id: '2',
              title: 'Πρώτο Βραβείο στον Διαγωνισμό Ρομποτικής',
              summary: 'Η ομάδα ρομποτικής του σχολείου μας κατέκτησε το πρώτο βραβείο στον πανελλήνιο διαγωνισμό ρομποτικής.',
              content: 'Η ομάδα ρομποτικής του σχολείου μας, αποτελούμενη από πέντε μαθητές της Β΄ Λυκείου, κατέκτησε το πρώτο βραβείο στον πανελλήνιο διαγωνισμό ρομποτικής που διεξήχθη στην Αθήνα το προηγούμενο Σαββατοκύριακο. Το ρομπότ που κατασκεύασαν είχε τη δυνατότητα να λύνει λαβύρινθους χρησιμοποιώντας αλγόριθμους μηχανικής μάθησης. Συγχαρητήρια σε όλη την ομάδα και στον καθηγητή Πληροφορικής που τους καθοδήγησε!',
              author: 'Διεύθυνση Σχολείου',
              date: '2025-04-02',
              imageUrl: 'https://images.unsplash.com/photo-1581092921461-39b9884ef2d1?ixlib=rb-4.0.3',
              category: 'achievements'
            },
            {
              id: '3',
              title: 'Αλλαγή στο Πρόγραμμα Εξετάσεων',
              summary: 'Ενημέρωση για αλλαγές στο πρόγραμμα των επερχόμενων εξετάσεων.',
              content: 'Σας ενημερώνουμε ότι λόγω τεχνικών προβλημάτων στις αίθουσες του σχολείου, το πρόγραμμα των επερχόμενων εξετάσεων έχει τροποποιηθεί. Οι εξετάσεις της Νεοελληνικής Γλώσσας και της Φυσικής μετατίθενται για την επόμενη εβδομάδα. Το νέο πρόγραμμα θα αναρτηθεί στην ιστοσελίδα του σχολείου και στον πίνακα ανακοινώσεων αύριο.',
              author: 'Γραμματεία',
              date: '2025-03-28',
              category: 'announcements'
            },
            {
              id: '4',
              title: 'Εκδρομή στο Αρχαιολογικό Μουσείο',
              summary: 'Προγραμματισμένη εκπαιδευτική επίσκεψη για τους μαθητές της Α΄ Γυμνασίου.',
              content: 'Την ερχόμενη Παρασκευή 18 Απριλίου, οι μαθητές της Α΄ Γυμνασίου θα πραγματοποιήσουν εκπαιδευτική επίσκεψη στο Αρχαιολογικό Μουσείο. Η αναχώρηση θα γίνει στις 9:00 π.μ. από το σχολείο και η επιστροφή αναμένεται στις 13:30 μ.μ. Οι μαθητές πρέπει να έχουν μαζί τους την υπεύθυνη δήλωση υπογεγραμμένη από τον κηδεμόνα τους μέχρι την Τετάρτη.',
              author: 'Καθηγητές Ιστορίας',
              date: '2025-03-25',
              category: 'events'
            },
            {
              id: '5',
              title: 'Έναρξη Εγγραφών για τα Θερινά Μαθήματα',
              summary: 'Ξεκίνησαν οι εγγραφές για τα θερινά μαθήματα ενισχυτικής διδασκαλίας.',
              content: 'Σας ενημερώνουμε ότι ξεκίνησαν οι εγγραφές για τα θερινά μαθήματα ενισχυτικής διδασκαλίας που θα πραγματοποιηθούν από 1 έως 31 Ιουλίου. Τα μαθήματα απευθύνονται σε μαθητές που επιθυμούν να ενισχύσουν τις γνώσεις τους σε βασικά μαθήματα όπως Μαθηματικά, Φυσική, Χημεία και Ξένες Γλώσσες. Οι ενδιαφερόμενοι μπορούν να δηλώσουν συμμετοχή στη γραμματεία του σχολείου μέχρι τις 15 Ιουνίου.',
              author: 'Διεύθυνση Σχολείου',
              date: '2025-03-20',
              category: 'announcements'
            }
          ];
          
          setArticles(defaultArticles);
          localStorage.setItem('school_news_articles', JSON.stringify(defaultArticles));
        }
      } catch (error) {
        console.error('Σφάλμα κατά τη φόρτωση των άρθρων:', error);
        toast.error('Παρουσιάστηκε πρόβλημα κατά τη φόρτωση των άρθρων.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  const createArticle = useCallback((article: Omit<NewsArticle, 'id' | 'date'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedArticles = [newArticle, ...articles];
    setArticles(updatedArticles);
    localStorage.setItem('school_news_articles', JSON.stringify(updatedArticles));
    
    toast.success('Το άρθρο δημιουργήθηκε με επιτυχία');
    return true;
  }, [articles]);

  const deleteArticle = useCallback((articleId: string) => {
    const updatedArticles = articles.filter(article => article.id !== articleId);
    setArticles(updatedArticles);
    localStorage.setItem('school_news_articles', JSON.stringify(updatedArticles));
    
    toast.success('Το άρθρο διαγράφηκε με επιτυχία');
    return true;
  }, [articles]);

  const filterArticles = useCallback(() => {
    let filtered = [...articles];
    
    // Φιλτράρισμα βάσει κατηγορίας
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    // Φιλτράρισμα βάσει αναζήτησης
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
      );
    }
    
    // Ταξινόμηση με βάση την ημερομηνία (νεότερα πρώτα)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return filtered;
  }, [articles, selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles: filterArticles(),
    loading,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    createArticle,
    deleteArticle,
    loadArticles,
    formatDate
  };
};
