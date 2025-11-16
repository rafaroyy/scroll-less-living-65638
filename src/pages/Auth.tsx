import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100, "Senha muito longa"),
});

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result.success) {
        toast({
          title: "Erro ao fazer login",
          description: result.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { sessionData } = result;

      if (sessionData?.access_token) {
        console.log("AUTH PAGE - Login successful, checking auth status...");
        
        // Verify auth is saved before redirecting
        const isAuthNow = authService.isAuthenticated();
        console.log("AUTH PAGE - isAuthenticated after login:", isAuthNow);
        
        toast({
          title: "Login realizado!",
          description: `Bem-vindo de volta, ${sessionData.username}!`,
        });
        
        setFormData({ email: "", password: "" });
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          console.log("AUTH PAGE - Redirecting to /editor");
          window.location.replace("/editor");
        }, 300);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
