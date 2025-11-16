import { Navigate } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";
import { useEffect, useState } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // Check authentication status multiple times to catch async updates
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      console.log("PUBLIC ROUTE - checkAuth:", { authenticated, checkCount });
      setIsAuthenticated(authenticated);
    };
    
    // Initial check
    checkAuth();
    
    // Recheck after a short delay to catch cookie/localStorage updates
    const timer = setTimeout(() => {
      checkAuth();
      setCheckCount(c => c + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [checkCount]);

  console.log("PUBLIC ROUTE - render:", { isAuthenticated, checkCount });

  // Show nothing while checking auth (only on first check)
  if (isAuthenticated === null && checkCount === 0) {
    return null;
  }

  if (isAuthenticated) {
    console.log("PUBLIC ROUTE - redirecting to /editor");
    return <Navigate to="/editor" replace />;
  }

  return <>{children}</>;
};