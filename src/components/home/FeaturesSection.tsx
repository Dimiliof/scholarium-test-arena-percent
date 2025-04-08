
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Γιατί να μας επιλέξετε</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Άμεση Αξιολόγηση</h3>
            <p className="text-gray-600">Δείτε τα αποτελέσματα και την πρόοδό σας αμέσως μετά την ολοκλήρωση κάθε τεστ</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Στοχευμένη Εξάσκηση</h3>
            <p className="text-gray-600">Εξασκηθείτε στα σημεία που χρειάζεστε περισσότερη βοήθεια</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Παντού και Πάντα</h3>
            <p className="text-gray-600">Πρόσβαση από όλες τις συσκευές, οποιαδήποτε στιγμή, ακόμα και εκτός σύνδεσης</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl">
            <h3 className="text-xl font-bold mb-3 text-green-800">Για Εκπαιδευτικούς & Σχολεία</h3>
            <p className="text-gray-700 mb-4">
              Η πλατφόρμα μας είναι διαθέσιμη δωρεάν για όλα τα σχολεία. 
              Οι εκπαιδευτικοί μπορούν να προσθέσουν το δικό τους εκπαιδευτικό υλικό 
              και να παρακολουθούν την πρόοδο των μαθητών τους.
            </p>
            <Link to="/school-registration">
              <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 border-0">
                Εγγραφή Σχολείου
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
