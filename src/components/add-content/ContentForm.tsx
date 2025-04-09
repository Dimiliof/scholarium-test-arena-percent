
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AddQuestionForm, QuizType } from '@/components/AddQuestionForm';
import AddResourceForm from '@/components/resources/AddResourceForm';
import { subjects } from '@/lib/subjectsData';

interface ContentFormProps {
  contentType: 'question' | 'resource';
  selectedSubject: string;
  handleBack: () => void;
  handleQuestionAdded: () => void;
  handleResourceAdded: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({
  contentType,
  selectedSubject,
  handleBack,
  handleQuestionAdded,
  handleResourceAdded
}) => {
  const initialQuizType = QuizType.BASIC;
  
  return (
    <div>
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-6"
      >
        &larr; Πίσω στα μαθήματα
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {contentType === 'question' ? (
              <>
                {subjects.find(s => s.id === selectedSubject)?.name} - Προσθήκη Νέας Ερώτησης
              </>
            ) : (
              <>
                {subjects.find(s => s.id === selectedSubject)?.name} - Προσθήκη Εκπαιδευτικού Πόρου
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contentType === 'question' ? (
            <AddQuestionForm 
              subjectId={selectedSubject}
              onSuccess={handleQuestionAdded}
              initialQuizType={initialQuizType}
            />
          ) : (
            <AddResourceForm 
              onSuccess={handleResourceAdded}
              selectedSubject={selectedSubject}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentForm;
