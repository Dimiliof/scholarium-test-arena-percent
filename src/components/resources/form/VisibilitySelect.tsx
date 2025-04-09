
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VisibilitySelectProps {
  isPublic: boolean;
  onChange: (value: boolean) => void;
}

const VisibilitySelect: React.FC<VisibilitySelectProps> = ({ isPublic, onChange }) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="visibility" className="flex-grow">
        Ορατό σε όλους τους μαθητές
        <p className="text-sm text-muted-foreground mt-1">Αν απενεργοποιηθεί, μόνο εσείς θα μπορείτε να δείτε αυτό το υλικό</p>
      </Label>
      <Switch 
        id="visibility" 
        checked={isPublic} 
        onCheckedChange={onChange} 
      />
    </div>
  );
};

export default VisibilitySelect;
