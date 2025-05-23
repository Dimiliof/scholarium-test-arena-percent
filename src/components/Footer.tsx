import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Λειτουργία σε εξέλιξη",
      description: `Η σελίδα ${feature} θα είναι διαθέσιμη σύντομα.`,
    });
  };

  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">EduPercentage</h3>
            <p className="text-gray-600 text-sm">
              Η εκπαιδευτική πλατφόρμα για μαθητές όλων των ηλικιών 
              που προσφέρει προσομοιώσεις και τεστ για όλα τα μαθήματα.
            </p>
            <p className="text-gray-600 text-sm mt-2 font-semibold">
              Δημόσια πλατφόρμα διαθέσιμη για όλα τα σχολεία.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Μαθήματα</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/subject/ancient-greek" className="text-gray-600 hover:text-primary">Αρχαία Ελληνική Γλώσσα</Link></li>
              <li><Link to="/subject/mathematics" className="text-gray-600 hover:text-primary">Μαθηματικά</Link></li>
              <li><Link to="/subject/physics" className="text-gray-600 hover:text-primary">Φυσική</Link></li>
              <li><Link to="/subject/history" className="text-gray-600 hover:text-primary">Ιστορία</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-primary">Όλα τα μαθήματα</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Χρήσιμοι Σύνδεσμοι</h3>
            <ul className="space-y-2 text-sm">
              <li><a onClick={() => handleComingSoon("Σχετικά με εμάς")} className="text-gray-600 hover:text-primary cursor-pointer">Σχετικά με εμάς</a></li>
              <li><a onClick={() => handleComingSoon("Επικοινωνία")} className="text-gray-600 hover:text-primary cursor-pointer">Επικοινωνία</a></li>
              <li><a onClick={() => handleComingSoon("Όροι Χρήσης")} className="text-gray-600 hover:text-primary cursor-pointer">Όροι Χρήσης</a></li>
              <li><a onClick={() => handleComingSoon("Πολιτική Απορρήτου")} className="text-gray-600 hover:text-primary cursor-pointer">Πολιτική Απορρήτου</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Επικοινωνία</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">Email: <a href="mailto:dimitris.liofis@atsoglou.gr" className="text-primary hover:underline">dimitris.liofis@atsoglou.gr</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">© 2025 Liofis Dimitrios, MsC IT support. Με επιφύλαξη παντός δικαιώματος.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-gray-600 text-sm flex items-center">
              Φτιαγμένο με <Heart className="h-4 w-4 text-red-500 mx-1" /> για την εκπαίδευση
            </span>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">Δωρεάν διάθεση για χρήση από όλα τα σχολεία της επικράτειας.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
