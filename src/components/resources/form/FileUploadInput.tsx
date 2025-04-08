
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FileUploadInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ onChange }) => {
  return (
    <div>
      <Label htmlFor="file">Ανέβασμα Αρχείου</Label>
      <Input
        id="file"
        name="file"
        type="file"
        onChange={onChange}
        className="cursor-pointer"
      />
      <p className="text-sm text-muted-foreground mt-1">
        Υποστηριζόμενοι τύποι αρχείων: PDF, DOCX, PPT, MP4, ZIP (έως 50MB)
      </p>
    </div>
  );
};

export default FileUploadInput;
