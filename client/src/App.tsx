import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./lib/theme";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import MainLayout from "@/components/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import PasswordManager from "@/pages/PasswordManager";
import PhishingSimulator from "@/pages/PhishingSimulator";
import NetworkScanner from "@/pages/NetworkScanner";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/dashboard" component={() => (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/password-manager" component={() => (
        <MainLayout>
          <PasswordManager />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/phishing-simulator" component={() => (
        <MainLayout>
          <PhishingSimulator />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/network-scanner" component={() => (
        <MainLayout>
          <NetworkScanner />
        </MainLayout>
      )} />
      
      <ProtectedRoute path="/settings" component={() => (
        <MainLayout>
          <Settings />
        </MainLayout>
      )} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <ThemeProvider defaultTheme="light" userId={user?.id || null}>
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
