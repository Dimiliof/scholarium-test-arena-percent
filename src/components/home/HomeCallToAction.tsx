
import React from 'react';
import CTASection from '@/components/home/CTASection';

interface HomeCallToActionProps {
  onCreateAccount: () => void;
}

const HomeCallToAction = ({ onCreateAccount }: HomeCallToActionProps) => {
  return <CTASection onCreateAccount={onCreateAccount} />;
};

export default HomeCallToAction;
