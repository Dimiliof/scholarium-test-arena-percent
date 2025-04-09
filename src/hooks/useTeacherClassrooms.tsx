
import { useState, useEffect } from 'react';

export interface ClassData {
  id: string;
  name: string;
  gradeLevel: string;
  studentsCount: number;
  createdAt: string;
}

export const useTeacherClassrooms = () => {
  const [classrooms, setClassrooms] = useState<ClassData[]>([]);

  const loadClassrooms = () => {
    // Φόρτωση τάξεων από localStorage ή API
    const savedClassrooms = localStorage.getItem('teacher_classrooms');
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    } else {
      // Δημιουργία προεπιλεγμένων τάξεων για όλες τις βαθμίδες
      const defaultClassrooms: ClassData[] = [
        { id: '1', name: 'Τμήμα Α1', gradeLevel: 'Α Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '2', name: 'Τμήμα Β1', gradeLevel: 'Β Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '3', name: 'Τμήμα Γ1', gradeLevel: 'Γ Γυμνασίου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '4', name: 'Τμήμα Α1', gradeLevel: 'Α Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '5', name: 'Τμήμα Β1', gradeLevel: 'Β Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
        { id: '6', name: 'Τμήμα Γ1', gradeLevel: 'Γ Λυκείου', studentsCount: 0, createdAt: new Date().toISOString() },
      ];
      setClassrooms(defaultClassrooms);
      localStorage.setItem('teacher_classrooms', JSON.stringify(defaultClassrooms));
    }
  };

  return {
    classrooms,
    setClassrooms,
    loadClassrooms
  };
};
