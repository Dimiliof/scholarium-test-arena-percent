
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface ClassData {
  id: string;
  name: string;
  gradeLevel: string;
  studentsCount: number;
  createdAt: string;
}

export const useTeacherClassrooms = () => {
  const [classrooms, setClassrooms] = useState<ClassData[]>([]);

  const loadClassrooms = useCallback(() => {
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
  }, []);

  const addStudentToClassroom = useCallback((classroomId: string) => {
    const updatedClassrooms = classrooms.map(classroom => {
      if (classroom.id === classroomId) {
        return {
          ...classroom,
          studentsCount: classroom.studentsCount + 1
        };
      }
      return classroom;
    });

    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    return true;
  }, [classrooms]);

  const removeStudentFromClassroom = useCallback((classroomId: string) => {
    const updatedClassrooms = classrooms.map(classroom => {
      if (classroom.id === classroomId && classroom.studentsCount > 0) {
        return {
          ...classroom,
          studentsCount: classroom.studentsCount - 1
        };
      }
      return classroom;
    });

    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    return true;
  }, [classrooms]);

  const createClassroom = useCallback((name: string, gradeLevel: string) => {
    if (!name.trim()) {
      toast.error('Παρακαλώ εισάγετε όνομα τάξης');
      return false;
    }

    const newClass: ClassData = {
      id: Date.now().toString(),
      name,
      gradeLevel,
      studentsCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedClassrooms = [...classrooms, newClass];
    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    
    toast.success('Η τάξη δημιουργήθηκε με επιτυχία');
    return true;
  }, [classrooms]);

  const deleteClassroom = useCallback((classId: string) => {
    const updatedClassrooms = classrooms.filter(c => c.id !== classId);
    setClassrooms(updatedClassrooms);
    localStorage.setItem('teacher_classrooms', JSON.stringify(updatedClassrooms));
    
    // Καθαρισμός δεδομένων που σχετίζονται με την τάξη
    localStorage.removeItem(`classroom_students_${classId}`);
    
    toast.success('Η τάξη διαγράφηκε με επιτυχία');
    return true;
  }, [classrooms]);

  return {
    classrooms,
    setClassrooms,
    loadClassrooms,
    addStudentToClassroom,
    removeStudentFromClassroom,
    createClassroom,
    deleteClassroom
  };
};
