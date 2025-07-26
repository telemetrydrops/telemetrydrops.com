
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-16">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-telemetria-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">404</h1>
        <div className="h-2 w-20 bg-telemetria-orange/50 mx-auto my-6" />
        <h2 className="text-3xl font-bold mb-4">Página não encontrada</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" /> Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
