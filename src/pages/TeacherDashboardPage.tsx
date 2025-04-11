
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherContent } from '@/hooks/useTeacherContent';
import { useTeacherClassrooms } from '@/hooks/useTeacherClassrooms';
import ContentTab from '@/components/teacher-dashboard/ContentTab';
import ClassesTab from '@/components/teacher-dashboard/ClassesTab';
import ResourceResponsesTab from '@/components/teacher-dashboard/ResourceResponsesTab';
import PlaceholderTab from '@/components/teacher-dashboard/PlaceholderTab';

const TeacherDashboardPage: React.FC = () => {
  const { isAuthenticated, isTeacher, user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    content, 
    isLoading, 
    searchQuery, 
    selectedSubject, 
    activeTab,
    loadTeacherContent, 
    setSearchQuery, 
    setSelectedSubject,
    setActiveTab,
    refreshContent,
    formatDate
  } = useTeacherContent();
  
  const { 
    classrooms, 
    setClassrooms, 
    loadClassrooms,
    createClassroom,
    deleteClassroom
  } = useTeacherClassrooms();

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      navigate('/login');
      return;
    }

    loadTeacherContent();
    loadClassrooms();
  }, [isAuthenticated, isTeacher, navigate, loadTeacherContent, loadClassrooms]);

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Πίνακας Ελέγχου Εκπαιδευτικού</h1>
          <p className="text-muted-foreground">
            Διαχειριστείτε το περιεχόμενό σας και τις τάξεις σας
          </p>
        </div>
        
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}` : ''} alt={user?.email || 'Προφίλ'} />
          <AvatarFallback>
            {user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-card border rounded-lg p-1 mb-6">
          <TabsTrigger value="content" className="flex-1">Περιεχόμενο</TabsTrigger>
          <TabsTrigger value="responses" className="flex-1">Απαντήσεις</TabsTrigger>
          <TabsTrigger value="classes" className="flex-1">Τάξεις</TabsTrigger>
          <TabsTrigger value="students" className="flex-1">Μαθητές</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Στατιστικά</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <ContentTab 
            isLoading={isLoading}
            content={content}
            searchQuery={searchQuery}
            selectedSubject={selectedSubject}
            setSearchQuery={setSearchQuery}
            setSelectedSubject={setSelectedSubject}
            refreshContent={refreshContent}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="responses">
          <ResourceResponsesTab />
        </TabsContent>
        
        <TabsContent value="classes">
          <ClassesTab 
            classrooms={classrooms}
            setClassrooms={setClassrooms}
            createClassroom={createClassroom}
            deleteClassroom={deleteClassroom}
          />
        </TabsContent>
        
        <TabsContent value="students">
          <PlaceholderTab 
            title="Μαθητές" 
            description="Διαχειριστείτε τους μαθητές και την πρόοδό τους." 
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <PlaceholderTab 
            title="Στατιστικά" 
            description="Δείτε στατιστικά χρήσης και προόδου των μαθητών σας." 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
