
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';

interface VisibilitySelectProps {
  isPublic: boolean;
  onChange: (value: boolean) => void;
}

const VisibilitySelect: React.FC<VisibilitySelectProps> = ({ isPublic, onChange }) => {
  const handleChange = (checked: boolean) => {
    onChange(checked);
    
    if (!checked) {
      toast.info(
        "Το υλικό θα είναι ορατό μόνο σε εσάς",
        {
          description: "Οι μαθητές δεν θα μπορούν να δουν αυτόν τον πόρο."
        }
      );
    } else {
      toast.success(
        "Το υλικό θα είναι ορατό σε όλους",
        {
          description: "Όλοι οι μαθητές θα μπορούν να δουν αυτόν τον πόρο."
        }
      );
    }
  };
  
  return (
    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
      <Label htmlFor="visibility" className="flex-grow">
        <span className="font-medium">Ορατό σε όλους τους μαθητές</span>
        <p className="text-sm text-muted-foreground mt-1">
          {isPublic 
            ? "Το υλικό θα είναι προσβάσιμο από όλους τους μαθητές." 
            : "Το υλικό θα είναι ορατό μόνο σε εσάς ως εκπαιδευτικό."}
        </p>
      </Label>
      <Switch 
        id="visibility" 
        checked={isPublic} 
        onCheckedChange={handleChange} 
      />
    </div>
  );
};

export default VisibilitySelect;
