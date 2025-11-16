import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, authReady } = useAuth();

  console.log("PUBLIC ROUTE - render:", { isAuthenticated, authReady });

  // Wait for auth to be ready
  if (!authReady) {
    console.log("PUBLIC ROUTE - waiting for auth to be ready");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log("PUBLIC ROUTE - redirecting to /editor");
    return <Navigate to="/editor" replace />;
  }

  console.log("PUBLIC ROUTE - not authenticated, rendering children");
  return <>{children}</>;
};