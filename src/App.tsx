
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubjectPage from "./pages/SubjectPage";
import QuizPage from "./pages/QuizPage";
import AddContentPage from "./pages/AddContentPage";
import SchoolRegistration from "./pages/SchoolRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/quiz/:subjectId/:quizType" element={<QuizPage />} />
          <Route path="/add-content" element={<AddContentPage />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
