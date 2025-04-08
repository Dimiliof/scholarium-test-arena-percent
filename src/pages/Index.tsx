import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { subjects } from '@/lib/subjectsData';
import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, Presentation } from 'lucide-react';

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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  const ecdlModules = [
    { id: 'ecdl-word', name: 'Word', icon: FileText, color: 'bg-blue-600' },
    { id: 'ecdl-excel', name: 'Excel', icon: FileSpreadsheet, color: 'bg-green-600' },
    { id: 'ecdl-powerpoint', name: 'PowerPoint', icon: Presentation, color: 'bg-orange-500' }
  ];

  const navigateToEcdlQuiz = (moduleId: string) => {
    navigate(`/quiz/${moduleId}/basic`);
  };

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
      
      <motion.div 
        className="py-12 bg-gradient-to-r from-gray-50 to-gray-100"
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
            Προσομοίωση ECDL
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-8 max-w-2xl mx-auto"
            variants={sectionVariants}
          >
            Εξασκηθείτε με ερωτήσεις προσομοίωσης για τις ενότητες του ECDL
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {ecdlModules.map((module) => {
              const ModuleIcon = module.icon;
              return (
                <Card key={module.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`${module.color} p-3 rounded-full mb-4`}>
                        <ModuleIcon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">ECDL {module.name}</h3>
                      <p className="text-gray-500 mb-4">
                        Ερωτήσεις πολλαπλής επιλογής για την ενότητα {module.name} του ECDL
                      </p>
                      <Button onClick={() => navigateToEcdlQuiz(module.id)} className="w-full">
                        Έναρξη Προσομοίωσης
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>
      
      <HomeFeaturesList />
      
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
