
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects } from '@/lib/subjectsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ClipboardCheck, Award, ChevronLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Το μάθημα δεν βρέθηκε</h1>
            <Link to="/">
              <Button>Επιστροφή στην αρχική</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Δυναμική εύρεση του κατάλληλου εικονιδίου
  const IconComponent = subject ? 
    (LucideIcons[subject.icon as keyof typeof LucideIcons] as LucideIcon) || 
    (() => <span className="text-white text-3xl">?</span>)
    : () => null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Subject Header */}
      <div className={`${subject?.color} py-10 text-white`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Επιστροφή στα μαθήματα
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <IconComponent className="h-12 w-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{subject?.name}</h1>
              <p className="text-xl text-white/90 max-w-2xl">{subject?.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
            <TabsTrigger value="practice">Εξάσκηση</TabsTrigger>
            <TabsTrigger value="tests">Διαγωνίσματα</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Περιγραφή Μαθήματος</h2>
                <p className="text-gray-700 mb-6">
                  Το μάθημα {subject.name} προσφέρει μια ολοκληρωμένη προσέγγιση στην κατανόηση 
                  και εφαρμογή των βασικών εννοιών. Μέσα από τις προσομοιώσεις και τα διαγωνίσματα,
                  οι μαθητές μπορούν να εξασκηθούν και να αξιολογήσουν τις γνώσεις τους.
                </p>
                
                <h3 className="text-xl font-bold mb-3">Τι θα μάθετε:</h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Βασικές έννοιες και ορισμοί</li>
                  <li>Μεθοδολογίες και τεχνικές επίλυσης προβλημάτων</li>
                  <li>Πρακτικές εφαρμογές</li>
                  <li>Προετοιμασία για σχολικές εξετάσεις</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Γρήγορη Έναρξη</h2>
                
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">Θεωρία & Σημειώσεις</h3>
                        <p className="text-sm text-gray-600">Διαβάστε τη θεωρία και τις σημειώσεις μαθήματος</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">Ασκήσεις Εξάσκησης</h3>
                        <p className="text-sm text-gray-600">Λύστε ασκήσεις και δείτε λύσεις βήμα-βήμα</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">Διαγωνίσματα</h3>
                        <p className="text-sm text-gray-600">Ελέγξτε τις γνώσεις σας με διαγωνίσματα εφ' όλης της ύλης</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" onClick={() => setActiveTab('practice')}>
                    Ξεκινήστε τώρα
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="practice">
            <div>
              <h2 className="text-2xl font-bold mb-6">Ασκήσεις Εξάσκησης</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Βασικές Ασκήσεις</h3>
                    <p className="text-gray-600 mb-4">Εισαγωγικές ασκήσεις για εξοικείωση με βασικές έννοιες</p>
                    <Link to={`/quiz/${subject.id}/basic`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Ενδιάμεσες Ασκήσεις</h3>
                    <p className="text-gray-600 mb-4">Ασκήσεις μεσαίου επιπέδου για εμβάθυνση γνώσεων</p>
                    <Link to={`/quiz/${subject.id}/intermediate`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Προχωρημένες Ασκήσεις</h3>
                    <p className="text-gray-600 mb-4">Ασκήσεις υψηλής δυσκολίας για προχωρημένους μαθητές</p>
                    <Link to={`/quiz/${subject.id}/advanced`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tests">
            <div>
              <h2 className="text-2xl font-bold mb-6">Διαγωνίσματα</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Διαγώνισμα 15 λεπτών</h3>
                    <p className="text-gray-600 mb-4">Σύντομο διαγώνισμα για γρήγορη αξιολόγηση</p>
                    <Link to={`/quiz/${subject.id}/quick`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Διαγώνισμα 30 λεπτών</h3>
                    <p className="text-gray-600 mb-4">Μεσαίο διαγώνισμα που καλύπτει βασικές έννοιες</p>
                    <Link to={`/quiz/${subject.id}/medium`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Διαγώνισμα Εφ' Όλης της Ύλης</h3>
                    <p className="text-gray-600 mb-4">Ολοκληρωμένο διαγώνισμα που καλύπτει όλη την ύλη</p>
                    <Link to={`/quiz/${subject.id}/full`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default SubjectPage;
