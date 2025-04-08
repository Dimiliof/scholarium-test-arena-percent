
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Ακύρωση
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Υποβολή...' : 'Προσθήκη Πόρου'}
      </Button>
    </div>
  );
};

export default FormActions;
