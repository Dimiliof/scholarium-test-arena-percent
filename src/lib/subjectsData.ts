export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
  availableTests?: number;
  availableMaterials?: number;
}

export const subjects: Subject[] = [
  { 
    id: 'ancient-greek-language', 
    name: 'Αρχαία Ελληνική Γλώσσα', 
    icon: ScrollText, 
    color: 'bg-purple-500',
    description: 'Μελέτη της αρχαίας ελληνικής γλώσσας και γραμματικής',
    availableTests: 25,
    availableMaterials: 50
  },
  { 
    id: 'mathematics', 
    name: 'Μαθηματικά', 
    icon: Calculator, 
    color: 'bg-green-500',
    description: 'Άλγεβρα, Γεωμετρία και Στατιστική',
    availableTests: 40,
    availableMaterials: 75
  },
];
