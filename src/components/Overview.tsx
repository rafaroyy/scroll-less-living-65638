
import { useEffect, useRef, useState } from "react";
import overviewImage from "@/assets/overview-image.png";

export const Overview = () => {
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

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-white via-brand-light to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            {/* Title and description */}
            <div className={`mb-16 pl-8 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-4xl md:text-5xl font-medium text-brand-dark mb-6 font-poppins text-left">
                Não é sorte. É framework.
              </h2>
              <p className="text-xl text-brand-dark/80 leading-relaxed font-poppins font-light text-left max-w-4xl">
                A Viralize AI entende padrões de viralização e monta vídeos com base em frameworks reais de venda. Copywriting + Design + Psicologia de Atenção em cada vídeo que você cria.
              </p>
            </div>

            {/* Centered Image */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95'
            }`}>
              <div className="relative max-w-5xl w-full">
                <div className="aspect-video bg-gradient-to-br from-brand-primary/10 via-blue-500/10 to-brand-secondary/10 rounded-3xl border-2 border-brand-secondary/30 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                  <img 
                    src={overviewImage}
                    alt="Interface do criador de vídeos virais"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
