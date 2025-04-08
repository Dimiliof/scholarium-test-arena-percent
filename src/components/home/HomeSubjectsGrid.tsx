
import React from 'react';
import SubjectsSection from '@/components/home/SubjectsSection';
import { Subject } from '@/lib/subjectsData';

interface HomeSubjectsGridProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const HomeSubjectsGrid = ({ subjects, isAuthenticated }: HomeSubjectsGridProps) => {
  return <SubjectsSection subjects={subjects} isAuthenticated={isAuthenticated} />;
};

export default HomeSubjectsGrid;
