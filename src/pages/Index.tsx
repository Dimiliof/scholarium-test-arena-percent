import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubjectCard from '@/components/SubjectCard';
import { subjects } from '@/lib/subjectsData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="gradient-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Προετοιμαστείτε για επιτυχία μέσα από προσομοιώσεις και διαγωνίσματα για όλα τα σχολικά μαθήματα
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Ξεκινήστε Τώρα
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Μάθετε Περισσότερα
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-4xl font-bold mb-2">17+</p>
              <p className="text-sm">Διαφορετικά Μαθήματα</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-sm">Τεστ και Προσομοιώσεις</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-sm">Ερωτήσεις και Ασκήσεις</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subjects Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Διαθέσιμα Μαθήματα</h2>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Αναζήτηση μαθήματος..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
        
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Δεν βρέθηκαν μαθήματα με αυτό το όνομα</p>
            <Button className="mt-4" onClick={() => setSearchTerm('')}>
              Εμφάνιση όλων των μαθημάτων
            </Button>
          </div>
        )}
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Γιατί να μας επιλέξετε</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Άμεση Αξιολόγηση</h3>
              <p className="text-gray-600">Δείτε τα αποτελέσματα και την πρόοδό σας αμέσως μετά την ολοκλήρωση κάθε τεστ</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Στοχευμένη Εξάσκηση</h3>
              <p className="text-gray-600">Εξασκηθείτε στα σημεία που χρειάζεστε περισσότερη βοήθεια</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Παντού και Πάντα</h3>
              <p className="text-gray-600">Πρόσβαση από όλες τις συσκευές, οποιαδήποτε στιγμή, ακόμα και εκτός σύνδεσης</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 md:py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Έτοιμοι να ξεκινήσετε;</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Δημιουργήστε λογαριασμό δωρεάν και ξεκινήστε να εξασκείστε στα μαθήματά σας</p>
          <Button size="lg" variant="secondary" className="animate-pulse-scale">
            Δημιουργία Λογαριασμού
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <Link to="/add-content">
          <Button className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-plus">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" x2="12" y1="18" y2="12"/>
              <line x1="9" x2="15" y1="15" y2="15"/>
            </svg>
            Προσθήκη Υλικού
          </Button>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
