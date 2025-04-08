
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GradeLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GradeLevelSelect: React.FC<GradeLevelSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="gradeLevel">Τάξη</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="gradeLevel">
          <SelectValue placeholder="Επιλέξτε τάξη" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Α Γυμνασίου">Α' Γυμνασίου</SelectItem>
          <SelectItem value="Β Γυμνασίου">Β' Γυμνασίου</SelectItem>
          <SelectItem value="Γ Γυμνασίου">Γ' Γυμνασίου</SelectItem>
          <SelectItem value="Α Λυκείου">Α' Λυκείου</SelectItem>
          <SelectItem value="Β Λυκείου">Β' Λυκείου</SelectItem>
          <SelectItem value="Γ Λυκείου">Γ' Λυκείου</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GradeLevelSelect;
