
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { School, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const SchoolIntegrationSection = () => {
  const isMobile = useIsMobile();
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="text-center mb-6 md:mb-8"
        variants={itemVariants}
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Σύνδεση με το Σχολείο σας</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Η πλατφόρμα μας παρέχει ολοκληρωμένες εκπαιδευτικές λύσεις για σχολεία και μαθητές
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-8"
        variants={itemVariants}
      >
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="bg-primary/10 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <School className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Σχολική Υποστήριξη</h3>
          </div>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            Προηγμένες εκπαιδευτικές λειτουργίες και υποστήριξη για σχολεία και εκπαιδευτικούς.
          </p>
          <Link to="/school-registration">
            <Button className="w-full text-sm">
              Εγγραφή Σχολικής Μονάδας
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="bg-primary/10 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Για Εκπαιδευτικούς</h3>
          </div>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            Πρόσβαση σε προηγμένες λειτουργίες και εκπαιδευτικό υλικό για εκπαιδευτικούς.
          </p>
          <Link to="/teacher-dashboard">
            <Button variant="outline" className="w-full text-sm">
              Χώρος Εκπαιδευτικών
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500"
        variants={itemVariants}
      >
        <p>Για οποιαδήποτε απορία ή βοήθεια, επικοινωνήστε με την <Link to="/contact" className="text-primary hover:underline">τεχνική υποστήριξη</Link>.</p>
      </motion.div>
    </div>
  );
};

export default SchoolIntegrationSection;
