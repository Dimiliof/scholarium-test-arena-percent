
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import BasicInfoInputs from './BasicInfoInputs';
import ResourceTypeSelect from './ResourceTypeSelect';
import SubjectSelect from './SubjectSelect';
import GradeLevelSelect from './GradeLevelSelect';
import ResourceUrlInput from './ResourceUrlInput';
import UploadTypeSelection from './UploadTypeSelection';
import VisibilitySelect from './VisibilitySelect';
import FormActions from './FormActions';
import { DriveFile } from './UploadTypeSelection';

interface ResourceFormValues {
  title: string;
  description: string;
  type: string;
  url: string;
  subject: string;
  gradeLevel: string;
  isPublic: boolean;
  file: File | null;
}

interface ResourceFormFieldsProps {
  initialValues: ResourceFormValues;
  selectedSubject?: string;
  onSubmit: (values: ResourceFormValues, driveFile: DriveFile | null) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const ResourceFormFields: React.FC<ResourceFormFieldsProps> = ({
  initialValues,
  selectedSubject,
  onSubmit,
  isLoading,
  onCancel
}) => {
  const [resource, setResource] = useState<ResourceFormValues>(initialValues);
  const [driveFile, setDriveFile] = useState<DriveFile | null>(null);

  useEffect(() => {
    if (driveFile) {
      setResource(prev => ({ ...prev, url: driveFile.viewLink }));
    }
  }, [driveFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResource(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResource(prev => ({ ...prev, [name]: value }));
    
    // Επαναφορά του URL όταν αλλάζει ο τύπος
    if (name === 'type') {
      setResource(prev => ({ ...prev, url: '' }));
      // Επαναφορά του αρχείου Drive όταν αλλάζει ο τύπος
      setDriveFile(null);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setResource(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResource(prev => ({ ...prev, file: e.target.files![0] }));
      // Καθαρισμός του αρχείου Drive όταν επιλέγεται τοπικό αρχείο
      setDriveFile(null);
    }
  };

  const handleDriveFileSelected = (file: DriveFile) => {
    setDriveFile(file);
    // Καθαρισμός του τοπικού αρχείου όταν επιλέγεται αρχείο από το Drive
    setResource(prev => ({ ...prev, file: null }));
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

    // Έλεγχος για τα αρχεία από το Drive
    if (driveFile) {
      return true;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(resource, driveFile);
  };

  // Προσδιορίζουμε αν πρέπει να δείξουμε το input URL βάσει του τύπου
  const showUrlInput = ['link', 'development', 'pdf', 'video'].includes(resource.type);
  // Προσδιορίζουμε αν πρέπει να δείξουμε την επιλογή ανεβάσματος αρχείου
  const showFileUpload = !showUrlInput || (showUrlInput && !resource.url);

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
        ) : null}
        
        {showFileUpload && (
          <UploadTypeSelection
            onFileChange={handleFileChange}
            onDriveFileSelected={handleDriveFileSelected}
            selectedFile={resource.file || driveFile}
          />
        )}
        
        <VisibilitySelect
          isPublic={resource.isPublic}
          onChange={(checked) => handleCheckboxChange('isPublic', checked)}
        />
      </div>
      
      <FormActions 
        isSubmitting={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ResourceFormFields;
