import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { subjects } from '@/lib/subjectsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ClipboardCheck, Award, ChevronLeft, Trophy, Medal, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ForumDiscussion from '@/components/forum/ForumDiscussion';

type LeaderboardStudent = {
  id: number;
  name: string;
  avatarUrl?: string;
  score: number;
  completedTests: number;
  lastActivity: string;
};

const mockLeaderboardData: LeaderboardStudent[] = [
  {
    id: 1,
    name: "Μαρία Παπαδοπούλου",
    score: 98,
    completedTests: 15,
    lastActivity: "23/04/2025"
  },
  {
    id: 2,
    name: "Γιώργος Αντωνίου",
    score: 95,
    completedTests: 12,
    lastActivity: "22/04/2025"
  },
  {
    id: 3,
    name: "Ελένη Δημητρίου",
    score: 92,
    completedTests: 14,
    lastActivity: "21/04/2025"
  },
  {
    id: 4,
    name: "Νίκος Γεωργίου",
    score: 90,
    completedTests: 13,
    lastActivity: "20/04/2025"
  },
  {
    id: 5,
    name: "Σοφία Αλεξίου",
    score: 87,
    completedTests: 11,
    lastActivity: "19/04/2025"
  },
  {
    id: 6,
    name: "Δημήτρης Βασιλείου",
    score: 85,
    completedTests: 10,
    lastActivity: "18/04/2025"
  },
  {
    id: 7,
    name: "Αναστασία Κωνσταντίνου",
    score: 82,
    completedTests: 9,
    lastActivity: "17/04/2025"
  },
  {
    id: 8,
    name: "Χρήστος Παπαδόπουλος",
    score: 78,
    completedTests: 8,
    lastActivity: "16/04/2025"
  },
  {
    id: 9,
    name: "Κατερίνα Ιωάννου",
    score: 76,
    completedTests: 7,
    lastActivity: "15/04/2025"
  },
  {
    id: 10,
    name: "Αντώνης Μιχαηλίδης",
    score: 72,
    completedTests: 6,
    lastActivity: "14/04/2025"
  }
];

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated } = useAuth();
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Απαιτείται σύνδεση</h1>
            <Link to="/login">
              <Button>Σύνδεση</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
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

  const IconComponent = subject.icon;

  const getRankIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (position === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 80) return "text-blue-600 font-medium";
    if (score >= 70) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-5 mb-8">
            <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
            <TabsTrigger value="practice">Εξάσκηση</TabsTrigger>
            <TabsTrigger value="tests">Διαγωνίσματα</TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Συζήτηση
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Κατάταξη</TabsTrigger>
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
                    <p className="text-gray-600 mb-4">Ο��οκληρωμένο διαγώνισμα που καλύπτει όλη την ύλη</p>
                    <Link to={`/quiz/${subject.id}/full`}>
                      <Button className="w-full">Έναρξη</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forum">
            <div>
              <h2 className="text-2xl font-bold mb-6">Φόρουμ Συζήτησης</h2>
              
              <ForumDiscussion subjectId={subjectId} />
              
              <div className="mt-6 flex justify-center">
                <Link to={`/forum/${subjectId}`}>
                  <Button variant="outline">
                    Προβολή όλων των συζητήσεων
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <div>
              <h2 className="text-2xl font-bold mb-6">Πίνακας Κατάταξης</h2>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableCaption>Οι κορυφαίοι μαθητές στο μάθημα {subject.name}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Θέση</TableHead>
                        <TableHead>Μαθητής</TableHead>
                        <TableHead className="text-center">Βαθμολογία</TableHead>
                        <TableHead className="text-center hidden md:table-cell">Διαγωνίσματα</TableHead>
                        <TableHead className="hidden md:table-cell">Τελευταία Δραστηριότητα</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeaderboardData.map((student, index) => (
                        <TableRow key={student.id} className={index < 3 ? "bg-muted/30" : ""}>
                          <TableCell className="text-center font-medium">
                            <div className="flex justify-center items-center">
                              {getRankIcon(index) || (index + 1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatarUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className={`text-center ${getScoreTextColor(student.score)}`}>
                            {student.score}/100
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {student.completedTests}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {student.lastActivity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="mt-8">
                <Card className="bg-muted/20 border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Η κατάταξή σου</div>
                          <div className="font-medium">15η θέση</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Βαθμολογία</div>
                        <div className="font-medium text-blue-600">68/100</div>
                      </div>
                    </div>
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
