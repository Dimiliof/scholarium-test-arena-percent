
import React, { useState } from 'react';
import { useQuestionManagement, ResourceType } from '@/hooks/useQuestionManagement';
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
import { Button } from '@/components/ui/button';
import { Download, Link2, FileText, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { subjects } from '@/lib/subjectsData';
import { toast } from 'sonner';

const ResourceResponsesTab: React.FC = () => {
  const { getResources, generateShareableLink } = useQuestionManagement();
  const [resources, setResources] = useState<ResourceType[]>(getResources());
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const refreshResources = () => {
    setResources(getResources());
  };
  
  const handleCopyLink = (resourceId: string) => {
    const link = generateShareableLink(resourceId);
    navigator.clipboard.writeText(link);
    setCopiedId(resourceId);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    
    toast.success("Ο σύνδεσμος αντιγράφηκε στο πρόχειρο!");
  };
  
  const handleViewResponses = (resource: ResourceType) => {
    setSelectedResource(resource);
    setShowResponses(true);
  };
  
  const getResponsesCount = (resource: ResourceType) => {
    return resource.responses ? resource.responses.length : 0;
  };
  
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Άγνωστο';
  };
  
  const getResourceTypeName = (type: string) => {
    const types: Record<string, string> = {
      'document': 'Έγγραφο',
      'pdf': 'PDF',
      'link': 'Σύνδεσμος',
      'development': 'Ανάπτυξη',
      'book': 'Βιβλίο',
      'video': 'Βίντεο'
    };
    return types[type] || type;
  };
  
  const exportToCsv = (resource: ResourceType) => {
    if (!resource.responses || resource.responses.length === 0) {
      toast.error("Δεν υπάρχουν απαντήσεις για εξαγωγή");
      return;
    }
    
    // Δημιουργία των επικεφαλίδων του CSV
    let csvContent = "Όνομα,Απάντηση,Χρονική Στιγμή\n";
    
    // Προσθήκη των δεδομένων
    resource.responses.forEach(response => {
      const studentName = response.studentName.replace(/,/g, " ");
      const responseText = response.response.replace(/,/g, " ").replace(/\n/g, " ");
      const timestamp = new Date(response.timestamp).toLocaleString('el-GR');
      
      csvContent += `"${studentName}","${responseText}","${timestamp}"\n`;
    });
    
    // Δημιουργία του Blob και του συνδέσμου λήψης
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${resource.title.replace(/\s+/g, '_')}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Υλικό & Απαντήσεις</CardTitle>
          <CardDescription>
            Διαχειριστείτε το εκπαιδευτικό υλικό που έχετε μοιραστεί και δείτε τις απαντήσεις των μαθητών
          </CardDescription>
          
          <div className="flex justify-end mt-2">
            <Button variant="outline" onClick={refreshResources}>
              Ανανέωση
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {resources.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Τίτλος</TableHead>
                  <TableHead>Μάθημα</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Ημ/νία</TableHead>
                  <TableHead>Απαντήσεις</TableHead>
                  <TableHead>Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map(resource => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSubjectName(resource.subject)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getResourceTypeName(resource.type)}</TableCell>
                    <TableCell>{resource.dateAdded}</TableCell>
                    <TableCell>
                      <Badge variant={getResponsesCount(resource) > 0 ? "default" : "secondary"}>
                        {getResponsesCount(resource)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCopyLink(resource.id)}
                          className="h-8 px-2 flex items-center"
                        >
                          {copiedId === resource.id ? (
                            <>Αντιγράφηκε!</>
                          ) : (
                            <>
                              <Link2 className="h-3.5 w-3.5 mr-1" />
                              Σύνδεσμος
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewResponses(resource)}
                          className="h-8 px-2 flex items-center"
                          disabled={!resource.responses || resource.responses.length === 0}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Απαντήσεις
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Δεν βρέθηκε εκπαιδευτικό υλικό</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Δεν έχετε προσθέσει ακόμα κάποιο εκπαιδευτικό υλικό.
                Προσθέστε υλικό από την επιλογή "Προσθήκη Υλικού".
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showResponses} onOpenChange={setShowResponses}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Απαντήσεις για: {selectedResource?.title}</DialogTitle>
            <DialogDescription>
              Συνολικά {selectedResource?.responses?.length || 0} απαντήσεις
            </DialogDescription>
          </DialogHeader>
          
          {selectedResource && selectedResource.responses && selectedResource.responses.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToCsv(selectedResource)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Εξαγωγή σε CSV
                </Button>
              </div>
              
              <div className="space-y-4">
                {selectedResource.responses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{response.studentName}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(response.timestamp).toLocaleString('el-GR')}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{response.response}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Δεν υπάρχουν απαντήσεις ακόμα</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResourceResponsesTab;
