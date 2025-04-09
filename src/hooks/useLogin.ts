
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const { login, isTeacher, isAdmin } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Attempting login with:", email);
      
      // Ειδικός έλεγχος για τον admin
      const isSpecialAdmin = email === "liofisdimitris@gmail.com" && password === "Skatadi21!";
      
      if (isSpecialAdmin) {
        console.log("Admin credential match detected");
      }
      
      const success = await login(email, password);
      console.log("Login success:", success);
      
      if (success) {
        console.log("Login successful, checking user roles");
        
        // Λαμβάνουμε τον χρήστη από το localStorage για να ελέγξουμε τους ρόλους
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log("User from localStorage:", user);
          
          // Βελτιωμένος έλεγχος ρόλων
          const isUserAdmin = user.role === "admin" || 
                            (user.roles && user.roles.includes("admin")) ||
                            user.email === "liofisdimitris@gmail.com";
                            
          const isUserTeacher = user.role === "teacher" || 
                              (user.roles && user.roles.includes("teacher")) ||
                              user.email === "liofisdimitris@gmail.com";
          
          const roleText = isUserAdmin ? "Διαχειριστής" : 
                          isUserTeacher ? "Εκπαιδευτικός" : "Μαθητής";
          
          console.log(`Login successful as ${roleText} (admin: ${isUserAdmin}, teacher: ${isUserTeacher})`);
          
          uiToast({
            title: "Επιτυχής σύνδεση",
            description: `Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά. Συνδεθήκατε ως ${roleText}.`,
          });
          
          toast.success(`Συνδεθήκατε ως ${roleText}`);
          
          // Ανακατεύθυνση με βάση τον ρόλο
          if (isUserAdmin) {
            console.log("Redirecting to admin dashboard");
            navigate("/admin/users");
            return; // Σημαντικό: τερματίζουμε τη συνάρτηση εδώ
          } 
          
          if (isUserTeacher) {
            console.log("Redirecting to teacher dashboard");
            navigate("/teacher-dashboard");
            return; // Σημαντικό: τερματίζουμε τη συνάρτηση εδώ
          } 
          
          console.log("Redirecting to student courses");
          navigate("/student/courses");
          return; // Σημαντικό: τερματίζουμε τη συνάρτηση εδώ
        } else {
          console.log("No user found in localStorage after successful login");
          uiToast({
            title: "Επιτυχής σύνδεση",
            description: "Καλωσήρθατε στην πλατφόρμα ΕκπαιδευτικήΓωνιά.",
          });
          navigate("/");
        }
      } else {
        console.log("Login failed - incorrect credentials");
        setLoginError("Λάθος email ή κωδικός πρόσβασης. Παρακαλώ προσπαθήστε ξανά.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Παρουσιάστηκε σφάλμα κατά τη σύνδεση. Παρακαλώ προσπαθήστε ξανά.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loginError,
    handleLogin,
  };
};
