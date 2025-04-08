import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

import Index from "./pages/Index";
import SubjectPage from "./pages/SubjectPage";
import QuizPage from "./pages/QuizPage";
import AddContentPage from "./pages/AddContentPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import SchoolRegistration from "./pages/SchoolRegistration";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";

import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminLoginsPage from "./pages/admin/AdminLoginsPage";
import ITSupportLoginPage from "./pages/ITSupportLoginPage";
import ITSupportPage from "./pages/ITSupportPage";

import CalculatorPage from "./pages/tools/CalculatorPage";
import ConverterPage from "./pages/tools/ConverterPage";
import PeriodicTablePage from "./pages/tools/PeriodicTablePage";
import FormulasPage from "./pages/tools/FormulasPage";

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
  const { isAuthenticated, isTeacher } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isTeacher) {
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/quiz/:subjectId/:quizType" element={<QuizPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/school-registration" element={<SchoolRegistration />} />
            <Route path="/it-support-login" element={<ITSupportLoginPage />} />
            
            <Route path="/tools/calculator" element={<CalculatorPage />} />
            <Route path="/tools/converter" element={<ConverterPage />} />
            <Route path="/tools/periodic-table" element={<PeriodicTablePage />} />
            <Route path="/tools/formulas" element={<FormulasPage />} />
            
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            <Route path="/add-content" element={<TeacherRoute><AddContentPage /></TeacherRoute>} />
            <Route path="/teacher-dashboard" element={<TeacherRoute><TeacherDashboardPage /></TeacherRoute>} />
            
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/logins" element={<AdminRoute><AdminLoginsPage /></AdminRoute>} />
            <Route path="/it-support" element={<AdminRoute><ITSupportPage /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
