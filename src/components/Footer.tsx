

import { Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Footer = () => {
  const footerLinks = {
    Produto: [
      { name: "Como Funciona", href: "/#how-social-limits-works" }
    ],
    Empresa: [
      { name: "Sobre Nós", href: "/our-story" },
      { name: "Nossa História", href: "/our-story" }
    ],
    Suporte: [
      { name: "Contato: viralai@gmail.com", href: "mailto:viralai@gmail.com" },
      { name: "Reportar Bugs", href: "https://sociallimits.featurebase.app/dashboard/posts" },
      { name: "Sugestões", href: "https://sociallimits.featurebase.app/dashboard/posts" }
    ],
    Legal: [
      { name: "Política de Privacidade", href: "/privacy-policy" },
      { name: "Termos de Serviço", href: "/privacy-policy" }
    ]
  };

  return (
    <footer className="bg-brand-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/f088cd0c-124c-4407-80c4-444f83204473.png" 
                alt="Viralize AI Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold font-poppins">Viralize AI</span>
            </div>
            <p className="text-brand-light mb-6 max-w-sm font-poppins font-light">
              Transforme suas ideias em vídeos virais com IA de última geração. Criação profissional em minutos.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold font-poppins">Fique Atualizado</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite seu email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 font-poppins"
                />
                <Button className="bg-brand-primary hover:bg-blue-700 font-poppins">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>
          
          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 font-poppins">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-light hover:text-white transition-colors duration-200 font-poppins font-light"
                      >
                        {link.name}
                      </a>
                    ) : link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        className="text-brand-light hover:text-white transition-colors duration-200 font-poppins font-light"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-brand-light hover:text-white transition-colors duration-200 font-poppins font-light"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-brand-light text-sm font-poppins font-light">
              © 2024 Viralize AI. Todos os direitos reservados.
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/sociallimits/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/social-limits/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

