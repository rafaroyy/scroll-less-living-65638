import { Navigate } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/editor" replace />;
  }

  return <>{children}</>;
};