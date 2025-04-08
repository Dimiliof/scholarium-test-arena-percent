
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { subjects } from '@/lib/subjectsData';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeHero from '@/components/home/HomeHero';
import HomeSubjectsGrid from '@/components/home/HomeSubjectsGrid';
import HomeFeaturesList from '@/components/home/HomeFeaturesList';
import HomeCallToAction from '@/components/home/HomeCallToAction';
import AddContentButton from '@/components/home/AddContentButton';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import QuizDemo from '@/components/home/QuizDemo';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const handleStartNow = () => {
    const subjectsSection = document.getElementById('subjects-section');
    if (subjectsSection) {
      subjectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = () => {
    toast({
      title: "Περισσότερες πληροφορίες",
      description: "Θα βρείτε περισσότερες πληροφορίες για την πλατφόρμα μας σύντομα.",
    });
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HomeHero 
        onStartNow={handleStartNow} 
        onLearnMore={handleLearnMore} 
      />
      <HomeSubjectsGrid 
        subjects={subjects} 
        isAuthenticated={isAuthenticated} 
      />
      <HomeFeaturesList />
      
      {/* Quiz Demo Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Δοκιμάστε την πλατφόρμα μας</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Κάντε ένα σύντομο τεστ για να δείτε πώς λειτουργεί η εκπαιδευτική μας πλατφόρμα
          </p>
          <div className="max-w-2xl mx-auto">
            <QuizDemo />
          </div>
        </div>
      </div>
      
      <TestimonialsSection />
      <HomeCallToAction 
        onCreateAccount={handleCreateAccount} 
      />
      
      {isAuthenticated && <AddContentButton />}
      
      <Footer />
    </div>
  );
};

export default Index;
