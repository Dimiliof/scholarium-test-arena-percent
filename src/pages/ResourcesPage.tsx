import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { BookText, FileText, Video, Link2, Download, BookOpen, Search } from 'lucide-react';

// Types for different resource types
type ResourceType = 'book' | 'document' | 'video' | 'link';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  subject: string;
  gradeLevel: string;
  authorName: string;
  authorEmail?: string;
  dateAdded: string;
  downloads: number;
}

const ResourcesPage = () => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Mock data for resources
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: "Οδηγός Μαθηματικών Α' Γυμνασίου",
      description: "Πλήρης οδηγός με όλη την ύλη των μαθηματικών για την Α' Γυμνασίου, με λυμένες ασκήσεις.",
      type: 'book',
      url: '/resources/math-guide-a.pdf',
      subject: 'mathematics',
      gradeLevel: 'Α Γυμνασίου',
      authorName: 'Δημήτρης Παπαδόπουλος',
      authorEmail: 'papadopoulos@school.edu.gr',
      dateAdded: '2023-09-15',
      downloads: 254
    },
    {
      id: '2',
      title: 'Σημειώσεις Φυσικής - Ηλεκτρισμός',
      description: 'Αναλυτικές σημειώσεις για το κεφάλαιο του Ηλεκτρισμού με παραδείγματα και ασκήσεις.',
      type: 'document',
      url: '/resources/physics-electricity.pdf',
      subject: 'physics',
      gradeLevel: 'Β Γυμνασίου',
      authorName: 'Μαρία Κωνσταντίνου',
      dateAdded: '2023-10-20',
      downloads: 187
    },
    {
      id: '3',
      title: 'Βιντεομάθημα: Χημικές αντιδράσεις',
      description: 'Αναλυτική παρουσίαση των βασικών χημικών αντιδράσεων με παραδείγματα.',
      type: 'video',
      url: 'https://youtube.com/watch?v=example123',
      subject: 'chemistry',
      gradeLevel: 'Γ Γυμνασίου',
      authorName: 'Γιώργος Αλεξίου',
      dateAdded: '2023-11-05',
      downloads: 312
    },
    {
      id: '4',
      title: 'Ιστορία Αρχαίας Ελλάδας - Διαφάνειες',
      description: 'Πλήρες σετ διαφανειών για την ιστορία της Αρχαίας Ελλάδας από την Αρχαϊκή έως την Ελληνιστική περίοδο.',
      type: 'document',
      url: '/resources/ancient-greece-slides.pptx',
      subject: 'history',
      gradeLevel: 'Α Λυκείου',
      authorName: 'Ελένη Παπαδημητρίου',
      dateAdded: '2023-12-10',
      downloads: 143
    },
    {
      id: '5',
      title: 'Εκπαιδευτικά παιχνίδια Γεωγραφίας',
      description: 'Συλλογή από διαδραστικά παιχνίδια για την εκμάθηση γεωγραφίας.',
      type: 'link',
      url: 'https://geography-games.edu/interactive',
      subject: 'geography',
      gradeLevel: 'Β Γυμνασίου',
      authorName: 'Ανδρέας Νικολάου',
      dateAdded: '2024-01-15',
      downloads: 98
    },
    {
      id: '6',
      title: 'Επαναληπτικές Ασκήσεις Άλγεβρας',
      description: 'Φυλλάδιο με επαναληπτικές ασκήσεις άλγεβρας για προετοιμασία εξετάσεων.',
      type: 'document',
      url: '/resources/algebra-exercises.pdf',
      subject: 'mathematics',
      gradeLevel: 'Γ Λυκείου',
      authorName: 'Κώστας Δημητρίου',
      dateAdded: '2024-02-20',
      downloads: 421
    }
  ]);

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesGradeLevel = selectedGradeLevel === 'all' || resource.gradeLevel === selectedGradeLevel;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesGradeLevel && matchesType;
  });

  // Function to get resource icon based on type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'book':
        return <BookText className="h-8 w-8 text-blue-600" />;
      case 'document':
        return <FileText className="h-8 w-8 text-green-600" />;
      case 'video':
        return <Video className="h-8 w-8 text-red-600" />;
      case 'link':
        return <Link2 className="h-8 w-8 text-purple-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  // Function to get human-readable resource type
  const getResourceTypeName = (type: ResourceType) => {
    switch (type) {
      case 'book':
        return 'Βιβλίο';
      case 'document':
        return 'Έγγραφο';
      case 'video':
        return 'Βίντεο';
      case 'link':
        return 'Σύνδεσμος';
      default:
        return 'Άλλο';
    }
  };

  // Function to get subject name
  const getSubjectName = (subjectId: string) => {
    const subjects: Record<string, string> = {
      'mathematics': 'Μαθηματικά',
      'physics': 'Φυσική',
      'chemistry': 'Χημεία',
      'history': 'Ιστορία',
      'geography': 'Γεωγραφία',
      'literature': 'Λογοτεχνία',
      'biology': 'Βιολογία',
      'computer_science': 'Πληροφορική'
    };
    
    return subjects[subjectId] || subjectId;
  };

  // Function to handle resource download
  const handleDownload = (resource: Resource) => {
    // In a real app, we would increment download counter in the database
    // and handle the actual download

    // For now, just open the URL
    window.open(resource.url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Εκπαιδευτικοί Πόροι</h1>
            <p className="text-muted-foreground">
              Βρείτε εκπαιδευτικό υλικό για όλα τα μαθήματα και τάξεις
            </p>
          </div>
          
          {(isTeacher || isAdmin) && (
            <Button 
              className="mt-4 md:mt-0" 
              onClick={() => window.location.href = '/add-content'}
            >
              Προσθήκη Νέου Πόρου
            </Button>
          )}
        </div>
        
        {/* Φίλτρα και αναζήτηση */}
        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Αναζήτηση..."
                className="w-full pl-10 p-2 border rounded-md"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="all">Όλα τα μαθήματα</option>
                <option value="mathematics">Μαθηματικά</option>
                <option value="physics">Φυσική</option>
                <option value="chemistry">Χημεία</option>
                <option value="history">Ιστορία</option>
                <option value="geography">Γεωγραφία</option>
                <option value="literature">Λογοτεχνία</option>
                <option value="biology">Βιολογία</option>
                <option value="computer_science">Πληροφορική</option>
              </select>
            </div>
            
            <div>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedGradeLevel}
                onChange={e => setSelectedGradeLevel(e.target.value)}
              >
                <option value="all">Όλες οι τάξεις</option>
                <option value="Α Γυμνασίου">Α' Γυμνασίου</option>
                <option value="Β Γυμνασίου">Β' Γυμνασίου</option>
                <option value="Γ Γυμνασίου">Γ' Γυμνασίου</option>
                <option value="Α Λυκείου">Α' Λυκείου</option>
                <option value="Β Λυκείου">Β' Λυκείου</option>
                <option value="Γ Λυκείου">Γ' Λυκείου</option>
              </select>
            </div>
            
            <div>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="all">Όλοι οι τύποι</option>
                <option value="book">Βιβλία</option>
                <option value="document">Έγγραφα</option>
                <option value="video">Βίντεο</option>
                <option value="link">Σύνδεσμοι</option>
              </select>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Πλέγμα</TabsTrigger>
              <TabsTrigger value="list">Λίστα</TabsTrigger>
            </TabsList>
            
            <p className="text-sm text-muted-foreground">
              {filteredResources.length} πόροι βρέθηκαν
            </p>
          </div>
          
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <Badge variant="outline">{getResourceTypeName(resource.type)}</Badge>
                        <Badge variant="secondary">{resource.gradeLevel}</Badge>
                      </div>
                      <Badge>{getSubjectName(resource.subject)}</Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${resource.authorName}`} />
                        <AvatarFallback>{resource.authorName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{resource.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(resource.dateAdded).toLocaleDateString('el-GR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/50 pt-3">
                    <div className="text-sm text-muted-foreground">
                      {resource.downloads} λήψεις
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(resource)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Λήψη
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredResources.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Δεν βρέθηκαν πόροι</h3>
                  <p className="text-muted-foreground">
                    Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Τίτλος</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Τύπος</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Μάθημα</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Τάξη</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Συγγραφέας</th>
                    <th className="px-4 py-3 text-right">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource, index) => (
                    <tr 
                      key={resource.id} 
                      className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-muted-foreground md:hidden">
                              {getSubjectName(resource.subject)} | {resource.gradeLevel}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline">{getResourceTypeName(resource.type)}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">{getSubjectName(resource.subject)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">{resource.gradeLevel}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${resource.authorName}`} />
                            <AvatarFallback>{resource.authorName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{resource.authorName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(resource)}
                          className="gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Λήψη</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredResources.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <p className="text-muted-foreground">
                          Δεν βρέθηκαν πόροι που να ταιριάζουν με τα κριτήρια αναζήτησης
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourcesPage;
