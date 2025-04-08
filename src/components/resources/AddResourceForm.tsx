
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AddResourceFormProps {
  onSuccess: () => void;
  selectedSubject?: string;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onSuccess, selectedSubject = '' }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [resource, setResource] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    subject: selectedSubject,
    gradeLevel: 'Α Γυμνασίου',
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setResource(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResource(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResource(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!resource.title.trim()) {
      toast.error('Παρακαλώ εισάγετε τίτλο για τον πόρο');
      return;
    }
    
    if (!resource.description.trim()) {
      toast.error('Παρακαλώ εισάγετε περιγραφή για τον πόρο');
      return;
    }
    
    if (!resource.subject) {
      toast.error('Παρακαλώ επιλέξτε μάθημα');
      return;
    }
    
    if (resource.type !== 'link' && !resource.file && !resource.url) {
      toast.error('Παρακαλώ ανεβάστε ένα αρχείο ή εισάγετε ένα URL');
      return;
    }
    
    if (resource.type === 'link' && !resource.url) {
      toast.error('Παρακαλώ εισάγετε ένα URL για τον σύνδεσμο');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, we would upload the file to a server
      // For now, we'll just simulate the upload
      
      setTimeout(() => {
        // Create resource in localStorage
        const storedResources = localStorage.getItem('educational_resources');
        const resources = storedResources ? JSON.parse(storedResources) : [];
        
        const newResource = {
          id: Date.now().toString(),
          title: resource.title,
          description: resource.description,
          type: resource.type,
          url: resource.url || (resource.file ? URL.createObjectURL(resource.file) : ''),
          subject: resource.subject,
          gradeLevel: resource.gradeLevel,
          authorName: user ? `${user.firstName} ${user.lastName}` : 'Ανώνυμος Εκπαιδευτικός',
          authorEmail: user?.email || '',
          dateAdded: new Date().toISOString().split('T')[0],
          downloads: 0
        };
        
        resources.push(newResource);
        localStorage.setItem('educational_resources', JSON.stringify(resources));
        
        toast.success('Ο εκπαιδευτικός πόρος προστέθηκε με επιτυχία!');
        
        // Reset form
        setResource({
          title: '',
          description: '',
          type: 'document',
          url: '',
          subject: selectedSubject,
          gradeLevel: 'Α Γυμνασίου',
          file: null,
        });
        
        // Call success callback
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Προέκυψε σφάλμα κατά την προσθήκη του πόρου');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Τίτλος Πόρου</Label>
          <Input
            id="title"
            name="title"
            value={resource.title}
            onChange={handleChange}
            placeholder="π.χ. Σημειώσεις Άλγεβρας Β' Γυμνασίου"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Περιγραφή</Label>
          <Textarea
            id="description"
            name="description"
            value={resource.description}
            onChange={handleChange}
            placeholder="Σύντομη περιγραφή του εκπαιδευτικού πόρου..."
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="type">Τύπος Περιεχομένου</Label>
            <Select 
              value={resource.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Επιλέξτε τύπο" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Έγγραφο</SelectItem>
                <SelectItem value="book">Βιβλίο</SelectItem>
                <SelectItem value="video">Βίντεο</SelectItem>
                <SelectItem value="link">Σύνδεσμος</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject">Μάθημα</Label>
            <Select 
              value={resource.subject} 
              onValueChange={(value) => handleSelectChange('subject', value)}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Επιλέξτε μάθημα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Μαθηματικά</SelectItem>
                <SelectItem value="physics">Φυσική</SelectItem>
                <SelectItem value="chemistry">Χημεία</SelectItem>
                <SelectItem value="biology">Βιολογία</SelectItem>
                <SelectItem value="history">Ιστορία</SelectItem>
                <SelectItem value="literature">Λογοτεχνία</SelectItem>
                <SelectItem value="geography">Γεωγραφία</SelectItem>
                <SelectItem value="computer_science">Πληροφορική</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="gradeLevel">Τάξη</Label>
            <Select 
              value={resource.gradeLevel} 
              onValueChange={(value) => handleSelectChange('gradeLevel', value)}
            >
              <SelectTrigger id="gradeLevel">
                <SelectValue placeholder="Επιλέξτε τάξη" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Α Γυμνασίου">Α' Γυμνασίου</SelectItem>
                <SelectItem value="Β Γυμνασίου">Β' Γυμνασίου</SelectItem>
                <SelectItem value="Γ Γυμνασίου">Γ' Γυμνασίου</SelectItem>
                <SelectItem value="Α Λυκείου">Α' Λυκείου</SelectItem>
                <SelectItem value="Β Λυκείου">Β' Λυκείου</SelectItem>
                <SelectItem value="Γ Λυκείου">Γ' Λυκείου</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {resource.type === 'link' ? (
          <div>
            <Label htmlFor="url">URL Συνδέσμου</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={resource.url}
              onChange={handleChange}
              placeholder="https://example.com/resource"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="file">Ανέβασμα Αρχείου</Label>
            <Input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Υποστηριζόμενοι τύποι αρχείων: PDF, DOCX, PPT, MP4, ZIP (έως 50MB)
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Ακύρωση
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Υποβολή...' : 'Προσθήκη Πόρου'}
        </Button>
      </div>
    </form>
  );
};

export default AddResourceForm;
