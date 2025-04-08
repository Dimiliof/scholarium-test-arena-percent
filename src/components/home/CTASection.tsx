
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onCreateAccount: () => void;
}

const CTASection = ({ onCreateAccount }: CTASectionProps) => {
  return (
    <div className="py-12 md:py-16 bg-primary text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Έτοιμοι να ξεκινήσετε;</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Δημιουργήστε λογαριασμό δωρεάν και ξεκινήστε να εξασκείστε στα μαθήματά σας</p>
        <Button size="lg" variant="secondary" className="animate-pulse-scale" onClick={onCreateAccount}>
          Δημιουργία Λογαριασμού
        </Button>
      </div>
    </div>
  );
};

export default CTASection;
