
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Lock, Eye } from 'lucide-react';

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
    <div className={`flex items-center justify-between space-x-2 border p-4 rounded-md ${isPublic ? 'bg-green-50' : 'bg-amber-50'}`}>
      <div className="flex items-start space-x-3">
        {isPublic ? (
          <Eye className="h-5 w-5 text-green-600 mt-0.5" />
        ) : (
          <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
        )}
        <Label htmlFor="visibility" className="flex-grow">
          <span className="font-medium">Ορατό σε όλους τους μαθητές</span>
          <p className="text-sm text-muted-foreground mt-1">
            {isPublic 
              ? "Το υλικό θα είναι προσβάσιμο από όλους τους μαθητές." 
              : "Το υλικό θα είναι ορατό μόνο σε εσάς ως εκπαιδευτικό."}
          </p>
        </Label>
      </div>
      <Switch 
        id="visibility" 
        checked={isPublic} 
        onCheckedChange={handleChange} 
      />
    </div>
  );
};

export default VisibilitySelect;
