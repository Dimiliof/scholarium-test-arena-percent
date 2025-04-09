
import React from 'react';
import SubjectsSection from '@/components/home/SubjectsSection';
import { Subject } from '@/lib/subjectsData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, AlertCircle, BookOpen, Search, Users } from 'lucide-react';

interface HomeSubjectsGridProps {
  subjects: Subject[];
  isAuthenticated: boolean;
}

const HomeSubjectsGrid = ({ subjects, isAuthenticated }: HomeSubjectsGridProps) => {
  const { isTeacher, isAdmin } = useAuth();
  
  // Εμφάνιση των μαθημάτων για όλους τους χρήστες
  return <SubjectsSection subjects={subjects} isAuthenticated={isAuthenticated} />;
};

export default HomeSubjectsGrid;
