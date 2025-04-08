
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

const queryClient = new QueryClient();

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
            <Route path="/add-content" element={<AddContentPage />} />
            <Route path="/school-registration" element={<SchoolRegistration />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Tool Routes */}
            <Route path="/tools/calculator" element={<CalculatorPage />} />
            <Route path="/tools/converter" element={<ConverterPage />} />
            <Route path="/tools/periodic-table" element={<PeriodicTablePage />} />
            <Route path="/tools/formulas" element={<FormulasPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
