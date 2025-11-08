import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="py-20 bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-brand-primary to-blue-400 rounded-full blur-xl animate-pulse transition-all duration-1000 ${isVisible ? 'scale-100 opacity-20' : 'scale-50 opacity-0'}`}></div>
        <div className={`absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse transition-all duration-1000 delay-500 ${isVisible ? 'scale-100 opacity-20' : 'scale-50 opacity-0'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-2xl animate-pulse transition-all duration-1000 delay-1000 ${isVisible ? 'scale-100 opacity-20' : 'scale-50 opacity-0'}`}></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 font-poppins transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Deixe a IA pensar como um
            <span className="bg-gradient-to-r from-brand-primary via-blue-400 to-brand-secondary bg-clip-text text-transparent"> criativo milionário</span>
          </h2>
          
          <p className={`text-xl text-brand-light mb-8 leading-relaxed font-poppins font-light transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Assine por R$97/mês e tenha acesso ao cérebro de quem vive de vídeos virais.</p>
          
          <div className={`flex justify-center items-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-brand-primary via-blue-500 to-purple-600 hover:from-purple-600 hover:via-blue-500 hover:to-brand-primary text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 font-poppins">
                Começar agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};