import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useAuth } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import LiveChatWidget from '@/components/chat/LiveChatWidget';

import Index from "./pages/Index";
import SubjectPage from "./pages/SubjectPage";
import QuizPage from "./pages/QuizPage";
import AddContentPage from "./pages/AddContentPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import SchoolRegistration from "./pages/SchoolRegistration";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeacherRegisterPage from "./pages/TeacherRegisterPage";
import RegisterSelectionPage from "./pages/RegisterSelectionPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForumPage from "./pages/ForumPage";
import ForumPostPage from "./pages/ForumPostPage";

import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminLoginsPage from "./pages/admin/AdminLoginsPage";
import ITSupportLoginPage from "./pages/ITSupportLoginPage";
import ITSupportPage from "./pages/ITSupportPage";
import NotificationSendPage from "./pages/teacher/NotificationSendPage";

import CalculatorPage from "./pages/tools/CalculatorPage";
import ConverterPage from "./pages/tools/ConverterPage";
import PeriodicTablePage from "./pages/tools/PeriodicTablePage";
import FormulasPage from "./pages/tools/FormulasPage";

import ResourcesPage from "./pages/ResourcesPage";

import StudentCoursesPage from "./pages/student/StudentCoursesPage";
import StudentEnrollPage from "./pages/student/StudentEnrollPage";
import StudentResultsPage from "./pages/student/StudentResultsPage";

import EcdlEmbedPage from './pages/EcdlEmbedPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 minutes
      gcTime: 900000, // 15 minutes (αντί για cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const TeacherRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Επιτρέπουμε πρόσβαση και στους διαχειριστές
  if (!isTeacher && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Επιτρέπουμε πρόσβαση μόνο στους μαθητές
  if (isTeacher || isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/subject/:subjectId" element={<SubjectPage />} />
                <Route path="/quiz/:subjectId/:quizType" element={<QuizPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register-type" element={<RegisterSelectionPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/teacher-register" element={<TeacherRegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/school-registration" element={<SchoolRegistration />} />
                <Route path="/it-support-login" element={<ITSupportLoginPage />} />
                
                <Route path="/forum/:subjectId" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
                <Route path="/forum/post/:postId" element={<ProtectedRoute><ForumPostPage /></ProtectedRoute>} />
                
                <Route path="/resources" element={<ResourcesPage />} />
                
                <Route path="/tools/calculator" element={<CalculatorPage />} />
                <Route path="/tools/converter" element={<ConverterPage />} />
                <Route path="/tools/periodic-table" element={<PeriodicTablePage />} />
                <Route path="/tools/formulas" element={<FormulasPage />} />
                
                <Route path="/student/courses" element={<StudentRoute><StudentCoursesPage /></StudentRoute>} />
                <Route path="/student/enroll" element={<StudentRoute><StudentEnrollPage /></StudentRoute>} />
                <Route path="/student/results" element={<StudentRoute><StudentResultsPage /></StudentRoute>} />
                
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                
                <Route path="/add-content" element={<TeacherRoute><AddContentPage /></TeacherRoute>} />
                <Route path="/teacher-dashboard" element={<TeacherRoute><TeacherDashboardPage /></TeacherRoute>} />
                <Route path="/classroom/:classroomId" element={<TeacherRoute><TeacherDashboardPage /></TeacherRoute>} />
                <Route path="/teacher/notifications" element={<TeacherRoute><NotificationSendPage /></TeacherRoute>} />
                
                <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                <Route path="/admin/logins" element={<AdminRoute><AdminLoginsPage /></AdminRoute>} />
                <Route path="/it-support" element={<AdminRoute><ITSupportPage /></AdminRoute>} />
                
                <Route path="/ecdl-demo-embed" element={<EcdlEmbedPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            <LiveChatWidget />
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
