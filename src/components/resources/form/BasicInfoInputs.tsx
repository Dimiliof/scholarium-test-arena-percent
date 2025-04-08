
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoInputsProps {
  title: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoInputs: React.FC<BasicInfoInputsProps> = ({ title, description, onChange }) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Τίτλος Πόρου</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="π.χ. Σημειώσεις Άλγεβρας Β' Γυμνασίου"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Περιγραφή</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Σύντομη περιγραφή του εκπαιδευτικού πόρου..."
          rows={3}
          required
        />
      </div>
    </>
  );
};

export default BasicInfoInputs;
