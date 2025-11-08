
import { Smartphone, Calendar, Target, BarChart3 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Features = () => {
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

  const features = [
    {
      id: "ai-generation",
      icon: <Smartphone className="w-6 h-6" />,
      title: "Frameworks de Viralização",
      description: "A IA que entende o que o algoritmo quer ver. Usa os mesmos frameworks que geraram +500M de views orgânicos.",
      image: "/lovable-uploads/55f408ad-fe3a-4da4-93ce-46487689c178.png"
    },
    {
      id: "smart-editing",
      icon: <Calendar className="w-6 h-6" />,
      title: "Copy Visual Inteligente",
      description: "Cada frame é pensado para segurar atenção. Estrutura persuasiva validada em milhões de impressões.",
      image: "/lovable-uploads/cab351f3-209a-4636-b44b-9a1f99f2df4b.png"
    },
    {
      id: "viral-optimization",
      icon: <Target className="w-6 h-6" />,
      title: "Gatilhos de Venda",
      description: "Vídeos que não só viralizam, mas vendem. Emoção + curiosidade + call to action em cada criativo.",
      image: "/lovable-uploads/813870de-8ff0-4cfe-8958-f7c32469ac85.png"
    },
    {
      id: "analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Cérebro de Especialista",
      description: "Criada por quem domina o orgânico. Acesse a mente de quem vive de vídeos virais.",
      image: "/lovable-uploads/7254f60e-8854-4a1f-98d9-333b4414d749.png"
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            {/* Title */}
            <h2 className={`text-4xl md:text-5xl font-medium text-brand-dark mb-12 font-poppins text-left pl-8 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              O que faz a diferença
            </h2>
            
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <Tabs defaultValue="ai-generation" className="w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left side - Tab navigation */}
                  <div className="space-y-4">
                    <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0 gap-2">
                      {features.map((feature, index) => (
                        <TabsTrigger
                          key={feature.id}
                          value={feature.id}
                          className={`w-full p-6 justify-start text-left bg-gray-50 hover:bg-gray-100 data-[state=active]:bg-brand-primary data-[state=active]:text-white rounded-xl transition-all duration-500 border-0 shadow-none hover:scale-102 hover:shadow-md ${
                            isVisible 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 -translate-x-10'
                          }`}
                          style={{ 
                            minHeight: '120px',
                            transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                          }}
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                              {feature.icon}
                            </div>
                            <div className="flex-grow text-left pr-4">
                              <h3 className="text-lg font-semibold font-poppins mb-2 leading-tight">
                                {feature.title}
                              </h3>
                              <p className="text-sm opacity-80 font-poppins leading-relaxed whitespace-normal">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  {/* Right side - Tab content */}
                  <div className="relative">
                    {features.map((feature) => (
                      <TabsContent
                        key={feature.id}
                        value={feature.id}
                        className="mt-0 transition-all duration-500 ease-in-out"
                      >
                        <div className="relative flex justify-center items-center" style={{ height: '500px' }}>
                          <div className="w-full max-w-md h-full bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center hover:shadow-2xl transition-shadow duration-500">
                            <img
                              src={feature.image}
                              alt={feature.title}
                              className="max-w-full max-h-full object-contain transform transition-all duration-500 hover:scale-105"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
