
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { subjects } from '@/lib/subjectsData';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PublicSchoolBanner from '@/components/home/PublicSchoolBanner';
import HeroSection from '@/components/home/HeroSection';
import SubjectsSection from '@/components/home/SubjectsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import AddContentButton from '@/components/home/AddContentButton';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const handleStartNow = () => {
    // Scroll to subjects section
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
      <PublicSchoolBanner />
      <HeroSection onStartNow={handleStartNow} onLearnMore={handleLearnMore} />
      <SubjectsSection subjects={subjects} isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <CTASection onCreateAccount={handleCreateAccount} />
      
      {isAuthenticated && <AddContentButton />}
      
      <Footer />
    </div>
  );
};

export default Index;
