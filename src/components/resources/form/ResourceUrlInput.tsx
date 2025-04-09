
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ResourceUrlInputProps {
  type: 'link' | 'development' | 'pdf' | 'video';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResourceUrlInput: React.FC<ResourceUrlInputProps> = ({ type, value, onChange }) => {
  const getPlaceholder = () => {
    switch (type) {
      case 'link':
        return "https://example.com/resource";
      case 'development':
        return "https://github.com/username/repository";
      case 'pdf':
        return "https://example.com/document.pdf";
      case 'video':
        return "https://www.youtube.com/watch?v=example";
      default:
        return "https://...";
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'link':
        return "URL Συνδέσμου";
      case 'development':
        return "URL Περιβάλλοντος Ανάπτυξης";
      case 'pdf':
        return "URL Αρχείου PDF";
      case 'video':
        return "URL Βίντεο";
      default:
        return "URL";
    }
  };

  const getHelperText = () => {
    switch (type) {
      case 'development':
        return "Εισάγετε το URL του repository ή του περιβάλλοντος ανάπτυξης (π.χ. GitHub, CodeSandbox, Repl.it)";
      case 'pdf':
        return "Εισάγετε το URL ενός αρχείου PDF που είναι αποθηκευμένο στο διαδίκτυο ή ανεβάστε ένα αρχείο";
      case 'video':
        return "Εισάγετε το URL ενός βίντεο (π.χ. YouTube, Vimeo) ή ανεβάστε ένα αρχείο";
      default:
        return null;
    }
  };

  return (
    <div>
      <Label htmlFor="url">{getLabel()}</Label>
      <Input
        id="url"
        name="url"
        type="url"
        value={value}
        onChange={onChange}
        placeholder={getPlaceholder()}
      />
      {getHelperText() && (
        <p className="text-sm text-muted-foreground mt-1">
          {getHelperText()}
        </p>
      )}
    </div>
  );
};

export default ResourceUrlInput;
