
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ChevronDown, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useQuestionManagement, ResourceType } from '@/hooks/useQuestionManagement';
import { subjects } from '@/lib/subjectsData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

const ResourceResponsesTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getResources } = useQuestionManagement();
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = () => {
    setLoading(true);
    const allResources = getResources();
    
    // Φιλτράρουμε για να πάρουμε μόνο τους πόρους του τρέχοντος εκπαιδευτικού
    const teacherResources = allResources.filter(
      resource => resource.authorEmail === user?.email
    );
    
    // Ταξινομούμε με βάση τους πόρους που έχουν απαντήσεις πρώτα
    const sortedResources = teacherResources.sort((a, b) => {
      const aResponses = a.responses?.length || 0;
      const bResponses = b.responses?.length || 0;
      return bResponses - aResponses;
    });
    
    setResources(sortedResources);
    setLoading(false);
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο';
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Έγγραφο</Badge>;
      case 'pdf':
        return <Badge className="bg-red-100 text-red-800 border-red-300">PDF</Badge>;
      case 'link':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Σύνδεσμος</Badge>;
      case 'video':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Βίντεο</Badge>;
      case 'book':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Βιβλίο</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{type}</Badge>;
    }
  };

  const handleViewResource = (resourceId: string) => {
    navigate(`/resources/${resourceId}`);
  };

  const handleViewResponses = (resource: ResourceType) => {
    setSelectedResource(resource);
  };

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Απαντήσεις Μαθητών</CardTitle>
          <CardDescription>
            Δείτε και διαχειριστείτε τις απαντήσεις των μαθητών στους εκπαιδευτικούς πόρους
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Αναζήτηση πόρων..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button onClick={() => navigate('/add-content')} className="md:ml-auto">
            Προσθήκη Νέου Πόρου
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Φόρτωση...</p>
              </div>
            ) : filteredResources.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredResources.map((resource) => (
                  <AccordionItem key={resource.id} value={resource.id}>
                    <div className="border-b">
                      <div className="flex items-center px-4 py-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getResourceTypeIcon(resource.type)}
                            <span className="font-medium">{resource.title}</span>
                          </div>
                          <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                            <span>{getSubjectName(resource.subject)}</span>
                            <span>•</span>
                            <span>{resource.gradeLevel}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={resource.responses && resource.responses.length > 0 ? "default" : "outline"}>
                            {resource.responses ? resource.responses.length : 0} απαντήσεις
                          </Badge>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewResource(resource.id);
                            }}
                            title="Προβολή πόρου"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <AccordionTrigger className="h-4 w-4 mr-2" />
                        </div>
                      </div>
                    </div>
                    
                    <AccordionContent>
                      {resource.responses && resource.responses.length > 0 ? (
                        <div className="px-4 py-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Μαθητής</TableHead>
                                <TableHead>Ημερομηνία</TableHead>
                                <TableHead>Απάντηση</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {resource.responses.map((response, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{response.studentName}</TableCell>
                                  <TableCell>
                                    {new Date(response.timestamp).toLocaleDateString('el-GR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </TableCell>
                                  <TableCell className="max-w-xs truncate">
                                    {response.response.substring(0, 60)}
                                    {response.response.length > 60 ? '...' : ''}
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          Περισσότερα
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                          <DialogTitle>Απάντηση μαθητή</DialogTitle>
                                          <DialogDescription className="flex flex-col gap-1">
                                            <span><strong>Μαθητής:</strong> {response.studentName}</span>
                                            <span><strong>Ημερομηνία:</strong> {new Date(response.timestamp).toLocaleDateString('el-GR', {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}</span>
                                            <span><strong>Πόρος:</strong> {resource.title}</span>
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto">
                                          <p className="whitespace-pre-line">{response.response}</p>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                          <Button onClick={() => handleViewResource(resource.id)} className="flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            Προβολή Πόρου
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                          <p>Δεν υπάρχουν απαντήσεις για αυτόν τον πόρο ακόμα.</p>
                          <Button 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => handleViewResource(resource.id)}
                          >
                            Προβολή Πόρου
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Δεν βρέθηκαν εκπαιδευτικοί πόροι. Προσθέστε νέους πόρους για να λάβετε απαντήσεις από τους μαθητές.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/add-content')}
                >
                  Προσθήκη Νέου Πόρου
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceResponsesTab;
