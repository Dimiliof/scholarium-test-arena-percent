
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    toast({
      title: "Λειτουργία σε εξέλιξη",
      description: "Η λειτουργία εισόδου θα είναι διαθέσιμη σύντομα.",
    });
  };

  const handleRegister = () => {
    toast({
      title: "Λειτουργία σε εξέλιξη",
      description: "Η λειτουργία εγγραφής θα είναι διαθέσιμη σύντομα.",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ΕκπαιδευτικήΓωνιά</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Αρχική
          </Link>
          <Link to="/school-registration" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Εγγραφή Σχολείου
          </Link>
          <Button variant="outline" className="ml-4" onClick={handleLogin}>
            Είσοδος
          </Button>
          <Button onClick={handleRegister}>
            Εγγραφή
          </Button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Αρχική
            </Link>
            <Link 
              to="/school-registration" 
              className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Εγγραφή Σχολείου
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="outline" className="w-full" onClick={handleLogin}>
                Είσοδος
              </Button>
              <Button className="w-full" onClick={handleRegister}>
                Εγγραφή
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
