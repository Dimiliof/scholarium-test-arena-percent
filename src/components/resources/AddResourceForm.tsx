
import React from 'react';
import { useResourceForm } from './hooks/useResourceForm';
import BasicInfoInputs from './form/BasicInfoInputs';
import ResourceTypeSelect from './form/ResourceTypeSelect';
import SubjectSelect from './form/SubjectSelect';
import GradeLevelSelect from './form/GradeLevelSelect';
import ResourceUrlInput from './form/ResourceUrlInput';
import FileUploadInput from './form/FileUploadInput';
import FormActions from './form/FormActions';
import VisibilitySelect from './form/VisibilitySelect';

interface AddResourceFormProps {
  onSuccess: () => void;
  selectedSubject?: string;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onSuccess, selectedSubject = '' }) => {
  const {
    resource,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit
  } = useResourceForm({ onSuccess, selectedSubject });

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
        
        {resource.type === 'link' || resource.type === 'development' ? (
          <ResourceUrlInput
            type={resource.type as 'link' | 'development'}
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
        isSubmitting={isSubmitting}
        onCancel={() => window.history.back()}
      />
    </form>
  );
};

export default AddResourceForm;
