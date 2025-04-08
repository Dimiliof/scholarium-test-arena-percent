
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onCancel, 
  submitText = 'Προσθήκη Πόρου',
  cancelText = 'Ακύρωση'
}) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Υποβολή...' : submitText}
      </Button>
    </div>
  );
};

export default FormActions;
