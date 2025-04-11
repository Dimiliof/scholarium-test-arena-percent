
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import SubjectPage from './pages/SubjectPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EditProfilePage from './pages/EditProfilePage';
import ForumPage from './pages/ForumPage';
import ForumPostPage from './pages/ForumPostPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import EcdlEmbedPage from './pages/EcdlEmbedPage';
import RegisterSelectionPage from './pages/RegisterSelectionPage';
import TeacherRegisterPage from './pages/TeacherRegisterPage';
import SchoolRegistration from './pages/SchoolRegistration';
import ITSupportPage from './pages/ITSupportPage';
import ITSupportLoginPage from './pages/ITSupportLoginPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminLoginsPage from './pages/admin/AdminLoginsPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ClassroomManagementPage from './pages/ClassroomManagementPage';
import AddContentPage from './pages/AddContentPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceViewPage from './pages/ResourceViewPage';

// Student pages
import StudentCoursesPage from './pages/student/StudentCoursesPage';
import StudentEnrollPage from './pages/student/StudentEnrollPage';
import StudentResultsPage from './pages/student/StudentResultsPage';

// Tool pages
import CalculatorPage from './pages/tools/CalculatorPage';
import ConverterPage from './pages/tools/ConverterPage';
import FormulasPage from './pages/tools/FormulasPage';
import PeriodicTablePage from './pages/tools/PeriodicTablePage';
import LiteratureAuthorsPage from './pages/tools/literature/LiteratureAuthorsPage';
import LiteraturePeriodsPage from './pages/tools/literature/LiteraturePeriodsPage';
import LiteratureResearchPage from './pages/tools/literature/LiteratureResearchPage';
import LiteratureSourceFinderPage from './pages/tools/literature/LiteratureSourceFinderPage';

import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterSelectionPage />} />
        <Route path="/register/teacher" element={<TeacherRegisterPage />} />
        <Route path="/register/student" element={<RegisterPage />} />
        <Route path="/register/school" element={<SchoolRegistration />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />
        <Route path="/quiz/:subjectId/:quizType" element={<QuizPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/post/:postId" element={<ForumPostPage />} />
        <Route path="/ecdl" element={<EcdlEmbedPage />} />
        <Route path="/it-support" element={<ITSupportPage />} />
        <Route path="/it-support-login" element={<ITSupportLoginPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/logins" element={<AdminLoginsPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
        <Route path="/add-content" element={<AddContentPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:resourceId" element={<ResourceViewPage />} />
        <Route path="/classroom/:classroomId" element={<ClassroomManagementPage />} />

        {/* Σελίδες μαθητή */}
        <Route path="/student/courses" element={<StudentCoursesPage />} />
        <Route path="/student/enroll" element={<StudentEnrollPage />} />
        <Route path="/student/results" element={<StudentResultsPage />} />

        {/* Σελίδες εργαλείων */}
        <Route path="/tools/calculator" element={<CalculatorPage />} />
        <Route path="/tools/converter" element={<ConverterPage />} />
        <Route path="/tools/formulas" element={<FormulasPage />} />
        <Route path="/tools/periodic-table" element={<PeriodicTablePage />} />
        <Route path="/tools/literature/authors" element={<LiteratureAuthorsPage />} />
        <Route path="/tools/literature/periods" element={<LiteraturePeriodsPage />} />
        <Route path="/tools/literature/research" element={<LiteratureResearchPage />} />
        <Route path="/tools/literature/sources" element={<LiteratureSourceFinderPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
