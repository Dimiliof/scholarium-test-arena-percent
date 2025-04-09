
import React from 'react';
import SubjectsSection from '@/components/home/SubjectsSection';
import { Subject } from '@/lib/subjectsData';
import { useAuth } from '@/contexts/AuthContext';

interface HomeSubjectsGridProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const HomeSubjectsGrid = ({ subjects, isAuthenticated }: HomeSubjectsGridProps) => {
  const { isTeacher, isAdmin } = useAuth();
  
  console.log('HomeSubjectsGrid rendering with subjects:', subjects.map(s => s.id));
  
  // Show all subjects for all users
  return <SubjectsSection subjects={subjects} isAuthenticated={isAuthenticated} />;
};

export default HomeSubjectsGrid;
