
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ResourceUrlInputProps {
  type: 'link' | 'development';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResourceUrlInput: React.FC<ResourceUrlInputProps> = ({ type, value, onChange }) => {
  return (
    <div>
      <Label htmlFor="url">URL {type === 'link' ? 'Συνδέσμου' : 'Περιβάλλοντος Ανάπτυξης'}</Label>
      <Input
        id="url"
        name="url"
        type="url"
        value={value}
        onChange={onChange}
        placeholder={type === 'link' ? "https://example.com/resource" : "https://github.com/username/repository"}
      />
      {type === 'development' && (
        <p className="text-sm text-muted-foreground mt-1">
          Εισάγετε το URL του repository ή του περιβάλλοντος ανάπτυξης (π.χ. GitHub, CodeSandbox, Repl.it)
        </p>
      )}
    </div>
  );
};

export default ResourceUrlInput;
