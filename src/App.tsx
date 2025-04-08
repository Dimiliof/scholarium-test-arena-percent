
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
import SchoolRegistration from "./pages/SchoolRegistration";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";

// Tool Pages
import CalculatorPage from "./pages/tools/CalculatorPage";
import ConverterPage from "./pages/tools/ConverterPage";
import PeriodicTablePage from "./pages/tools/PeriodicTablePage";
import FormulasPage from "./pages/tools/FormulasPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 minutes
      cacheTime: 900000, // 15 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
            {/* Public Routes */}
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
            
            {/* Tool Routes - Publicly Accessible */}
            <Route path="/tools/calculator" element={<CalculatorPage />} />
            <Route path="/tools/converter" element={<ConverterPage />} />
            <Route path="/tools/periodic-table" element={<PeriodicTablePage />} />
            <Route path="/tools/formulas" element={<FormulasPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/add-content" element={<ProtectedRoute><AddContentPage /></ProtectedRoute>} />
            
            {/* Catch-all - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
