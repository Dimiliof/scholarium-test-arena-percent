
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  initials: string;
  type: 'student' | 'teacher' | 'parent';
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Μαρία Β.',
    role: 'Μαθήτρια Β΄ Γυμνασίου',
    content: 'Χάρη σε αυτή την πλατφόρμα, κατάφερα να βελτιώσω τις επιδόσεις μου στη Φυσική και τα Μαθηματικά. Οι διαδραστικές ασκήσεις είναι εξαιρετικές και με βοήθησαν να καταλάβω έννοιες που δυσκολευόμουν!',
    initials: 'ΜΒ',
    type: 'student'
  },
  {
    id: 2,
    name: 'Νίκος Π.',
    role: 'Καθηγητής Φυσικής',
    content: 'Ως εκπαιδευτικός, βρίσκω την πλατφόρμα εξαιρετικά χρήσιμη. Μπορώ να δημιουργώ προσαρμοσμένα τεστ για τους μαθητές μου και να παρακολουθώ την πρόοδό τους αποτελεσματικά.',
    initials: 'ΝΠ',
    type: 'teacher'
  },
  {
    id: 3,
    name: 'Ελένη Μ.',
    role: 'Γονέας μαθητή Α΄ Γυμνασίου',
    content: 'Ο γιος μου χρησιμοποιεί την πλατφόρμα καθημερινά και έχω δει σημαντική βελτίωση στους βαθμούς του. Η μετάβαση στο γυμνάσιο έγινε πολύ πιο ομαλά. Συστήνω ανεπιφύλακτα σε όλους τους γονείς!',
    initials: 'ΕΜ',
    type: 'parent'
  },
  {
    id: 4,
    name: 'Δημήτρης Α.',
    role: 'Μαθητής Α΄ Γυμνασίου',
    content: 'Τα διαγωνίσματα προσομοίωσης με βοήθησαν να προετοιμαστώ πολύ καλύτερα για τις εξετάσεις. Οι επεξηγήσεις είναι απλές και κατανοητές! Εξαιρετικό εργαλείο για όλους τους μαθητές γυμνασίου.',
    initials: 'ΔΑ',
    type: 'student'
  }
];

const getBadgeColor = (type: 'student' | 'teacher' | 'parent') => {
  switch (type) {
    case 'student':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'teacher':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'parent':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    default:
      return '';
  }
};

const getTypeLabel = (type: 'student' | 'teacher' | 'parent') => {
  switch (type) {
    case 'student':
      return 'Μαθητής';
    case 'teacher':
      return 'Εκπαιδευτικός';
    case 'parent':
      return 'Γονέας';
    default:
      return '';
  }
};

const TestimonialsSection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Τι Λένε οι Χρήστες μας</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Δείτε τι λένε μαθητές γυμνασίου, εκπαιδευτικοί και γονείς για την εκπαιδευτική μας πλατφόρμα
        </p>
        
        {/* Εμφάνιση του grid για μεγάλες οθόνες */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Carousel για μικρές και μεσαίες οθόνες */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 pl-4">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

// Δημιουργία ξεχωριστού component για την κάρτα μαρτυρίας
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Avatar className="h-10 w-10">
            {testimonial.avatar ? (
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {testimonial.initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        </div>
        <p className="text-gray-700 italic">"{testimonial.content}"</p>
        <div className="mt-4">
          <Badge variant="outline" className={getBadgeColor(testimonial.type)}>
            {getTypeLabel(testimonial.type)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
