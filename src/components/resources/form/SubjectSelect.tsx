
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects } from '@/lib/subjectsData';

interface SubjectSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SubjectSelect: React.FC<SubjectSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="subject">Μάθημα</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="subject">
          <SelectValue placeholder="Επιλέξτε μάθημα" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectSelect;
