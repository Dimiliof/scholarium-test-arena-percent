
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { School, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolIntegrationSection = () => {
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
        className="text-center mb-8"
        variants={itemVariants}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Σύνδεση με το Σχολείο σας</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Η πλατφόρμα μας παρέχει ολοκληρωμένες εκπαιδευτικές λύσεις για σχολεία και μαθητές
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8 mt-8"
        variants={itemVariants}
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Σχολική Υποστήριξη</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Προηγμένες εκπαιδευτικές λειτουργίες και υποστήριξη για σχολεία και εκπαιδευτικούς.
          </p>
          <Link to="/school-registration">
            <Button className="w-full">
              Εγγραφή Σχολικής Μονάδας
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Για Εκπαιδευτικούς</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Πρόσβαση σε προηγμένες λειτουργίες και εκπαιδευτικό υλικό για εκπαιδευτικούς.
          </p>
          <Link to="/teacher-dashboard">
            <Button variant="outline" className="w-full">
              Χώρος Εκπαιδευτικών
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        variants={itemVariants}
      >
        <p>Για οποιαδήποτε απορία ή βοήθεια, επικοινωνήστε με την <Link to="/contact" className="text-primary hover:underline">τεχνική υποστήριξη</Link>.</p>
      </motion.div>
    </div>
  );
};

export default SchoolIntegrationSection;
