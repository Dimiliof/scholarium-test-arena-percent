
import React, { useState } from 'react';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';
import { useAuth } from '@/contexts/AuthContext';
import BasicInfoInputs from './form/BasicInfoInputs';
import ResourceTypeSelect from './form/ResourceTypeSelect';
import SubjectSelect from './form/SubjectSelect';
import GradeLevelSelect from './form/GradeLevelSelect';
import ResourceUrlInput from './form/ResourceUrlInput';
import FileUploadInput from './form/FileUploadInput';
import FormActions from './form/FormActions';
import VisibilitySelect from './form/VisibilitySelect';
import { toast } from 'sonner';

interface AddResourceFormProps {
  onSuccess: () => void;
  selectedSubject?: string;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onSuccess, selectedSubject = '' }) => {
  const { user } = useAuth();
  const { addResource, isLoading } = useQuestionManagement();
  
  const [resource, setResource] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    subject: selectedSubject,
    gradeLevel: 'Α Γυμνασίου',
    isPublic: true,
    file: null as File | null,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResource(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResource(prev => ({ ...prev, [name]: value }));
    
    // Επαναφορά του URL όταν αλλάζει ο τύπος
    if (name === 'type') {
      setResource(prev => ({ ...prev, url: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setResource(prev => ({ ...prev, [name]: checked }));
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
    
    if ((resource.type === 'link' || resource.type === 'development' || 
         resource.type === 'pdf' || resource.type === 'video') && !resource.url) {
      toast.error(`Παρακαλώ εισάγετε ένα URL για ${
        resource.type === 'link' ? 'τον σύνδεσμο' : 
        resource.type === 'development' ? 'το περιβάλλον ανάπτυξης' :
        resource.type === 'pdf' ? 'το PDF' : 'το βίντεο'
      }`);
      return false;
    }
    
    if (resource.type !== 'link' && resource.type !== 'development' && 
        resource.type !== 'pdf' && resource.type !== 'video' && !resource.file) {
      toast.error('Παρακαλώ ανεβάστε ένα αρχείο');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    let fileUrl = resource.url;
    
    // Αν έχουμε αρχείο, δημιουργούμε ένα URL για αυτό (για λόγους επίδειξης)
    if (resource.file) {
      fileUrl = URL.createObjectURL(resource.file);
    }
    
    const newResource = {
      title: resource.title,
      description: resource.description,
      type: resource.type as any,
      url: fileUrl,
      subject: resource.subject,
      gradeLevel: resource.gradeLevel,
      isPublic: resource.isPublic,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Ανώνυμος Εκπαιδευτικός',
      authorEmail: user?.email || '',
    };
    
    const resourceId = addResource(newResource);
    
    if (resourceId) {
      // Επαναφορά της φόρμας
      setResource({
        title: '',
        description: '',
        type: 'document',
        url: '',
        subject: selectedSubject,
        gradeLevel: 'Α Γυμνασίου',
        isPublic: true,
        file: null,
      });
      
      onSuccess();
    }
  };

  // Προσδιορίζουμε αν πρέπει να δείξουμε το input URL βάσει του τύπου
  const showUrlInput = ['link', 'development', 'pdf', 'video'].includes(resource.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <BasicInfoInputs
          title={resource.title}
          description={resource.description}
          onChange={handleChange}
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ResourceTypeSelect
            value={resource.type}
            onChange={(value) => handleSelectChange('type', value)}
          />
          
          <SubjectSelect
            value={resource.subject}
            onChange={(value) => handleSelectChange('subject', value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GradeLevelSelect
            value={resource.gradeLevel}
            onChange={(value) => handleSelectChange('gradeLevel', value)}
          />
        </div>
        
        {showUrlInput ? (
          <ResourceUrlInput
            type={resource.type as any}
            value={resource.url}
            onChange={handleChange}
          />
        ) : (
          <FileUploadInput onChange={handleFileChange} />
        )}
        
        <VisibilitySelect
          isPublic={resource.isPublic}
          onChange={(checked) => handleCheckboxChange('isPublic', checked)}
        />
      </div>
      
      <FormActions 
        isSubmitting={isLoading}
        onCancel={() => window.history.back()}
      />
    </form>
  );
};

export default AddResourceForm;
