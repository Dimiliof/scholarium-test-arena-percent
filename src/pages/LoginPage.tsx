
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useLogin } from "@/hooks/useLogin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const { isLoading, loginError, handleLogin } = useLogin();

  // Προσθήκη useEffect για να καθαρίσουμε τυχόν περιττές εγγραφές στο localStorage
  useEffect(() => {
    console.log("LoginPage rendered, checking authentication state");
  }, []);

  const onSubmit = async (values: { email: string; password: string }) => {
    await handleLogin(values.email, values.password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Είσοδος</CardTitle>
              <CardDescription>
                Εισάγετε τα στοιχεία σας για να συνδεθείτε
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm 
                onSubmit={onSubmit}
                isLoading={isLoading}
                loginError={loginError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
