import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, School, BookOpen, BookText, FileText, Video, Link2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileMenu = () => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Μενού</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <Link to="/" className="flex items-center text-xl font-bold text-primary">
              <School className="h-6 w-6 mr-2 text-primary" />
              <span>EduPercentage</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-lg font-medium hover:text-primary">
              Αρχική
            </Link>
            <Link to="/resources" className="text-lg font-medium hover:text-primary flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Εκπαιδευτικοί Πόροι
            </Link>
            
            {/* Εκπαιδευτικοί Πόροι - Υποκατηγορίες */}
            <div className="pt-1 pb-2 pl-7">
              <div className="flex flex-col space-y-2 text-muted-foreground">
                <Link to="/resources?type=book" className="flex items-center text-sm hover:text-primary">
                  <BookText className="h-4 w-4 mr-2" />
                  Βιβλία
                </Link>
                <Link to="/resources?type=document" className="flex items-center text-sm hover:text-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Έγγραφα
                </Link>
                <Link to="/resources?type=video" className="flex items-center text-sm hover:text-primary">
                  <Video className="h-4 w-4 mr-2" />
                  Βίντεο
                </Link>
                <Link to="/resources?type=link" className="flex items-center text-sm hover:text-primary">
                  <Link2 className="h-4 w-4 mr-2" />
                  Σύνδεσμοι
                </Link>
              </div>
            </div>
            
            {/* Μαθήματα */}
            <div className="pt-2 pb-2">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Μαθήματα</p>
              <div className="pl-2 flex flex-col space-y-2">
                <Link to="/subject/mathematics" className="text-lg font-medium hover:text-primary">
                  Μαθηματικά
                </Link>
                <Link to="/subject/physics" className="text-lg font-medium hover:text-primary">
                  Φυσική
                </Link>
              </div>
            </div>
            
            {/* Εργαλεία */}
            <div className="pt-2 pb-2">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Εργαλεία</p>
              <div className="pl-2 flex flex-col space-y-2">
                <Link to="/tools/calculator" className="text-lg font-medium hover:text-primary">
                  Υπολογιστής
                </Link>
                <Link to="/tools/converter" className="text-lg font-medium hover:text-primary">
                  Μετατροπέας
                </Link>
                <Link to="/tools/periodic-table" className="text-lg font-medium hover:text-primary">
                  Περιοδικός Πίνακας
                </Link>
                <Link to="/tools/formulas" className="text-lg font-medium hover:text-primary">
                  Συλλογή Τύπων
                </Link>
              </div>
            </div>

            {/* Επιλογές για μαθητές */}
            {isAuthenticated && !isTeacher && !isAdmin && (
              <div className="pt-2 pb-2">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Μαθητικό Προφίλ</p>
                <div className="pl-2 flex flex-col space-y-2">
                  <Link to="/student/courses" className="text-lg font-medium hover:text-primary">
                    Τα Μαθήματά μου
                  </Link>
                  <Link to="/student/enroll" className="text-lg font-medium hover:text-primary">
                    Εγγραφή σε Μάθημα
                  </Link>
                  <Link to="/student/results" className="text-lg font-medium hover:text-primary">
                    Τα Αποτελέσματά μου
                  </Link>
                </div>
              </div>
            )}

            <Link to="/about" className="text-lg font-medium hover:text-primary">
              Σχετικά
            </Link>
            {isAuthenticated && (isTeacher || isAdmin) && (
              <Link to="/add-content" className="text-lg font-medium hover:text-primary">
                Προσθήκη Υλικού
              </Link>
            )}
            
            {/* IT Support Link */}
            <Link to="/it-support-login" className="text-lg font-medium hover:text-primary flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-primary" />
              IT Support
            </Link>
            
            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">Σύνδεση</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full">Εγγραφή</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
