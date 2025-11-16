import { Navigate } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";
import { useEffect, useState } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
  }, []);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/editor" replace />;
  }

  return <>{children}</>;
};