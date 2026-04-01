import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const { login } = useAuth();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(user, password)) {
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div id="login-page" className="min-h-screen flex items-center justify-center bg-background">
      <div id="login-card" className="w-full max-w-md p-8 rounded-xl bg-card border border-border shadow-2xl">
        <div id="login-header" className="flex flex-col items-center mb-8">
          <div id="login-icon" className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-primary" />
          </div>
          <h1 id="login-title" className="text-3xl font-bold text-primary tracking-tight">
            Yandel's Music
          </h1>
          <p id="login-subtitle" className="text-muted-foreground mt-1">
            Inicia sesión para continuar
          </p>
        </div>
        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          <div id="login-user-field">
            <label id="login-user-label" htmlFor="login-user" className="text-sm font-medium text-foreground block mb-1.5">
              Usuario
            </label>
            <Input
              id="login-user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div id="login-password-field">
            <label id="login-password-label" htmlFor="login-password" className="text-sm font-medium text-foreground block mb-1.5">
              Contraseña
            </label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {error && (
            <p id="login-error" className="text-destructive text-sm text-center">
              {error}
            </p>
          )}
          <Button id="login-submit" type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
