
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { subjects } from '@/lib/subjectsData';
import { motion } from "framer-motion";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeHero from '@/components/home/HomeHero';
import HomeSubjectsGrid from '@/components/home/HomeSubjectsGrid';
import HomeFeaturesList from '@/components/home/HomeFeaturesList';
import HomeCallToAction from '@/components/home/HomeCallToAction';
import AddContentButton from '@/components/home/AddContentButton';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import QuizDemo from '@/components/home/QuizDemo';
import SchoolIntegration from '@/components/home/SchoolIntegration';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
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
      
      {/* School Integration Section */}
      <motion.div 
        className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <SchoolIntegration />
        </div>
      </motion.div>
      
      {/* Quiz Demo Section */}
      <motion.div 
        className="py-16 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center mb-4"
            variants={sectionVariants}
          >
            Δοκιμάστε την πλατφόρμα μας
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            variants={sectionVariants}
          >
            Κάντε ένα σύντομο τεστ για να δείτε πώς λειτουργεί η εκπαιδευτική μας πλατφόρμα
          </motion.p>
          <div className="max-w-2xl mx-auto">
            <QuizDemo />
          </div>
        </div>
      </motion.div>
      
      <TestimonialsSection />
      <HomeCallToAction onCreateAccount={handleCreateAccount} />
      
      {isAuthenticated && <AddContentButton />}
      
      <Footer />
    </div>
  );
};

export default Index;
