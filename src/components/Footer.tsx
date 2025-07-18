
import { Link } from "react-router-dom";
import { Youtube, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-telemetria-darker border-t border-white/5 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Telemetry Drops" 
                className="h-10 w-10"
              />
              <span className="font-bold text-xl tracking-tight">Telemetry Drops</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              We offer digital products related to OpenTelemetry (OTel) 
              for professionals looking to enhance their knowledge in monitoring 
              and observability.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://www.youtube.com/@TelemetryDrops" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/telemetrydrops" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@telemetrydrops.com"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <a 
                  href="https://blog.telemetrydrops.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm flex items-center"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/otel-specialization" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  OTel Specialization
                </Link>
              </li>
              <li>
                <Link to="/products/otel-track" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  OTel Track
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Telemetry Drops GmbH. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-sm text-white/70 hover:text-telemetria-yellow transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-use" className="text-sm text-white/70 hover:text-telemetria-yellow transition-colors">
                Terms of Use
              </Link>
              <Link to="/imprint" className="text-sm text-white/70 hover:text-telemetria-yellow transition-colors">
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
