
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartNow: () => void;
  onLearnMore: () => void;
}

const HeroSection = ({ onStartNow, onLearnMore }: HeroSectionProps) => {
  return (
    <div className="gradient-bg text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Προετοιμαστείτε για επιτυχία μέσα από προσομοιώσεις και διαγωνίσματα για όλα τα σχολικά μαθήματα
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100" onClick={onStartNow}>
            Ξεκινήστε Τώρα
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={onLearnMore}>
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
  );
};

export default HeroSection;
