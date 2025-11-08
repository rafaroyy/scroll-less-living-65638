
import { TrendingUp, Clock, Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      number: "5 MIN",
      description: "Tempo Médio de Criação",
      subtext: "Do prompt ao vídeo pronto",
      color: "from-blue-500 to-brand-primary",
      backgroundImage: "/lovable-uploads/cb45477f-2c13-426a-9545-1f4922ebca3f.png"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      number: "3.5X",
      description: "Mais Engajamento",
      subtext: "Comparado a vídeos tradicionais",
      color: "from-green-500 to-emerald-600",
      backgroundImage: "/lovable-uploads/15a13bd0-3756-464e-9250-b09638d9ca86.png"
    },
    {
      icon: <Activity className="w-8 h-8 text-white" />,
      number: "95%",
      description: "Taxa de Viralização",
      subtext: "Vídeos otimizados para algoritmos",
      color: "from-purple-500 to-violet-600",
      backgroundImage: "/lovable-uploads/4043d8e3-38c4-465e-b41d-9d435cfe076d.png"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-white via-brand-light to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            <div className={`mb-16 pl-8 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-4xl md:text-5xl font-medium text-brand-dark mb-4 font-poppins text-left">
                O Poder da Criação com IA
              </h2>
              <p className="text-xl text-brand-dark/80 max-w-2xl font-poppins font-light text-left">
                Veja como nossa IA está revolucionando a criação de conteúdo para milhares de criadores
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-8 rounded-2xl bg-white border border-brand-secondary/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: isVisible ? `${index * 200}ms` : '0ms',
                    transitionDuration: '800ms'
                  }}
                >
                  {/* Background Image with Overlay for all stats */}
                  {stat.backgroundImage && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${stat.backgroundImage})` }}
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <div>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className={`text-4xl md:text-5xl font-bold mb-2 font-poppins group-hover:scale-105 transition-transform duration-300 ${
                      stat.backgroundImage ? 'text-white' : 'text-brand-dark'
                    }`}>
                      {stat.number}
                    </h3>
                    <p className={`text-lg font-semibold mb-2 font-poppins ${
                      stat.backgroundImage ? 'text-white' : 'text-brand-dark'
                    }`}>
                      {stat.description}
                    </p>
                    <p className={`text-sm font-poppins font-light ${
                      stat.backgroundImage ? 'text-white/80' : 'text-brand-dark/60'
                    }`}>
                      {stat.subtext}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
