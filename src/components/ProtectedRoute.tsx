import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, authReady } = useAuth();

  console.log("PROTECTED ROUTE - render:", { isAuthenticated, authReady });

  // Wait for auth to be ready
  if (!authReady) {
    console.log("PROTECTED ROUTE - waiting for auth to be ready");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("PROTECTED ROUTE - redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("PROTECTED ROUTE - authenticated, rendering children");
  return <>{children}</>;
};