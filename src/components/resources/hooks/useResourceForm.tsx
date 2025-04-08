
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ResourceFormInput {
  title: string;
  description: string;
  type: string;
  url: string;
  subject: string;
  gradeLevel: string;
  file: File | null;
}

interface UseResourceFormProps {
  onSuccess: () => void;
  selectedSubject?: string;
}

export const useResourceForm = ({ onSuccess, selectedSubject = '' }: UseResourceFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [resource, setResource] = useState<ResourceFormInput>({
    title: '',
    description: '',
    type: 'document',
    url: '',
    subject: selectedSubject,
    gradeLevel: 'Α Γυμνασίου',
    file: null,
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

  const validateForm = (): boolean => {
    if (!resource.title.trim()) {
      toast.error('Παρακαλώ εισάγετε τίτλο για τον πόρο');
      return false;
    }
    
    if (!resource.description.trim()) {
      toast.error('Παρακαλώ εισάγετε περιγραφή για τον πόρο');
      return false;
    }
    
    if (!resource.subject) {
      toast.error('Παρακαλώ επιλέξτε μάθημα');
      return false;
    }
    
    if (resource.type !== 'link' && resource.type !== 'development' && !resource.file && !resource.url) {
      toast.error('Παρακαλώ ανεβάστε ένα αρχείο ή εισάγετε ένα URL');
      return false;
    }
    
    if ((resource.type === 'link' || resource.type === 'development') && !resource.url) {
      toast.error(`Παρακαλώ εισάγετε ένα URL για ${resource.type === 'link' ? 'τον σύνδεσμο' : 'το περιβάλλον ανάπτυξης'}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate the upload process
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

  return {
    resource,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleSubmit
  };
};
