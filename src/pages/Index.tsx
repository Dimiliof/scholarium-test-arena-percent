
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { subjects } from '@/lib/subjectsData';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeHero from '@/components/home/HomeHero';
import HomeSubjectsGrid from '@/components/home/HomeSubjectsGrid';
import HomeCallToAction from '@/components/home/HomeCallToAction';
import AddContentButton from '@/components/home/AddContentButton';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SchoolIntegrationSection from '@/components/home/SchoolIntegrationSection';
import DownloadAppButton from '@/components/home/DownloadAppButton';
// Removed duplicate LiveChatWidget import since it's already included globally in App.tsx

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
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
      
      <div id="subjects-section">
        <HomeSubjectsGrid 
          subjects={subjects} 
          isAuthenticated={isAuthenticated} 
        />
      </div>
      
      <motion.div 
        className={`py-8 ${isMobile ? 'px-4' : 'py-12'} bg-gradient-to-r from-blue-50 to-indigo-50`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <SchoolIntegrationSection />
        </div>
      </motion.div>
      
      <TestimonialsSection />
      <HomeCallToAction onCreateAccount={handleCreateAccount} />
      
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-4">
        {isAuthenticated && <AddContentButton />}
      </div>
      
      <DownloadAppButton />
      
      <Footer />
      
      {/* Removed LiveChatWidget from here as it's included globally in App.tsx */}
    </div>
  );
};

export default Index;
