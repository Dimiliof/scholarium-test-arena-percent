
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from '@/components/ui/motion';

interface HomeHeroProps {
  onStartNow: () => void;
  onLearnMore: () => void;
}

const HomeHero = ({ onStartNow, onLearnMore }: HomeHeroProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="gradient-bg text-white py-12 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6">
          Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
          Προετοιμαστείτε για επιτυχία μέσα από προσομοιώσεις και διαγωνίσματα για όλα τα σχολικά μαθήματα
        </p>
        
        {/* School logo and name container */}
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.img 
            src="/lovable-uploads/461462d9-ca3e-4ee9-98df-343b08ba812d.png" 
            alt="Εκπαιδευτήρια Ατσόγλου" 
            className="h-24 md:h-32 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90">
            ΕΚΠΑΙΔΕΥΤΗΡΙΑ ΑΤΣΟΓΛΟΥ
            <br />
            <span className="text-base md:text-lg lg:text-xl text-white/80">ΤΟ ΣΧΟΛΕΙΟ ΠΟΥ ΒΛΕΠΕΙ ΤΟ ΜΕΛΛΟΝ</span>
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-white text-primary hover:bg-gray-100" 
            onClick={onStartNow}
          >
            Ξεκινήστε Τώρα
          </Button>
          <Button 
            size={isMobile ? "default" : "lg"} 
            variant="outline" 
            className="text-white border-white hover:bg-white/10" 
            onClick={onLearnMore}
          >
            Μάθετε Περισσότερα
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6">
            <p className="text-3xl md:text-4xl font-bold mb-2">17+</p>
            <p className="text-xs md:text-sm">Διαφορετικά Μαθήματα</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6">
            <p className="text-3xl md:text-4xl font-bold mb-2">100+</p>
            <p className="text-xs md:text-sm">Τεστ και Προσομοιώσεις</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6">
            <p className="text-3xl md:text-4xl font-bold mb-2">1000+</p>
            <p className="text-xs md:text-sm">Ερωτήσεις και Ασκήσεις</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
