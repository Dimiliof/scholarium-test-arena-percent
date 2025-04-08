
// Θα διορθώσουμε το interface EnhancedSubject για να ταιριάζει με τον τύπο Subject

// Ορισμός του interface EnhancedSubject:
interface EnhancedSubject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string; // Το κάνουμε required αντί για optional
  availableTests?: number;
  availableMaterials?: number;
  teacherName: string;
  isEnrolled: boolean;
}

// Και στην αρχικοποίηση της μεταβλητής subjectsWithEnrollment, θα χρειαστεί να βεβαιωθούμε
// ότι όλα τα Subject objects έχουν description (θέτοντας default τιμή αν λείπει):
const subjectsWithEnrollment: EnhancedSubject[] = subjects.map(subject => ({
  ...subject,
  description: subject.description || 'Δεν υπάρχει διαθέσιμη περιγραφή', // Παρέχουμε default τιμή
  teacherName: getRandomTeacher(),
  isEnrolled: Math.random() > 0.5 // Τυχαία εγγραφή για demo
}));
