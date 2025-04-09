
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentTypeSelectorProps {
  contentType: 'question' | 'resource';
  setContentType: (type: 'question' | 'resource') => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ contentType, setContentType }) => {
  return (
    <div className="mb-6">
      <Tabs defaultValue={contentType} onValueChange={(value) => setContentType(value as 'question' | 'resource')}>
        <TabsList className="mb-4">
          <TabsTrigger value="question">Ερωτήσεις / Κουίζ</TabsTrigger>
          <TabsTrigger value="resource">Εκπαιδευτικοί Πόροι</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ContentTypeSelector;
