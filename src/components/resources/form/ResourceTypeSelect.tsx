
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ResourceTypeSelect: React.FC<ResourceTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="type">Τύπος Περιεχομένου</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="type">
          <SelectValue placeholder="Επιλέξτε τύπο" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="document">Έγγραφο</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="book">Βιβλίο</SelectItem>
          <SelectItem value="video">Βίντεο</SelectItem>
          <SelectItem value="link">Σύνδεσμος</SelectItem>
          <SelectItem value="development">Ανάπτυξη</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResourceTypeSelect;
