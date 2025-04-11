
import React, { useState } from 'react';
import { useResourceSubmit } from './form/useResourceSubmit';
import GoogleFormOption from './form/GoogleFormOption';
import ResourceFormFields from './form/ResourceFormFields';
import { DriveFile } from './form/UploadTypeSelection';
import { toast } from 'sonner';

interface AddResourceFormProps {
  onSuccess: () => void;
  selectedSubject?: string;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onSuccess, selectedSubject = '' }) => {
  const [useGoogleForm, setUseGoogleForm] = useState(false);
  const { submitResource, isLoading } = useResourceSubmit(onSuccess);
  
  // The Google Form URL - replace with your actual Google Form URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfYmN9Zgj9rYLfICFuXDtxkuf9qh9wHHcUvF-uRnZzL7Qbdiw/viewform";
  
  const initialResourceValues = {
    title: '',
    description: '',
    type: 'document',
    url: '',
    subject: selectedSubject,
    gradeLevel: 'Α Γυμνασίου',
    isPublic: true,
    file: null as File | null,
  };
  
  const handleSubmit = (resourceValues: typeof initialResourceValues, driveFile: DriveFile | null) => {
    const success = submitResource(resourceValues, driveFile);
    
    if (success) {
      // Reset will be handled by the submission hook and the onSuccess callback
    }
  };

  const handleGoogleFormSubmit = () => {
    window.open(googleFormUrl, '_blank');
    toast.success('Ανακατεύθυνση στη φόρμα Google για υποβολή υλικού');
  };

  return (
    <>
      <GoogleFormOption 
        useGoogleForm={useGoogleForm}
        setUseGoogleForm={setUseGoogleForm}
        googleFormUrl={googleFormUrl}
      />
      
      {!useGoogleForm && (
        <ResourceFormFields
          initialValues={initialResourceValues}
          selectedSubject={selectedSubject}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => window.history.back()}
        />
      )}
    </>
  );
};

export default AddResourceForm;
