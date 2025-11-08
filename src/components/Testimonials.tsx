
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  // Preload all testimonial images
  useEffect(() => {
    testimonials.forEach((testimonial) => {
      const img = new Image();
      img.src = testimonial.avatar;
    });
  }, []);
  
  const testimonials = [
    {
      quote: "Transformou completamente meu processo de criação. O que antes levava dias, agora levo minutos. Meus vídeos estão viralizando mais do que nunca!",
      name: "Romy",
      role: "Criadora de Conteúdo",
      avatar: "/lovable-uploads/1cf97f45-251a-43cc-a4fc-45e8b2030890.png"
    },
    {
      quote: "Impressionante como a IA entende exatamente o que eu quero. Criei 50 vídeos em uma semana e todos tiveram performance acima da média. Game changer total!",
      name: "James Martin",
      role: "Digital Marketer", 
      avatar: "/lovable-uploads/4cace87a-72b2-4a87-bdc8-47858de2eb28.png"
    },
    {
      quote: "Como influenciadora, preciso produzir muito conteúdo. Este app me deu superpoderes. A qualidade é profissional e o tempo de produção caiu 90%.",
      name: "Kristel Van De Kamp",
      role: "Influenciadora",
      avatar: "/lovable-uploads/1a145619-bc46-42c9-b41e-ce45dfd20e67.png"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            <div className={`mb-16 pl-8 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-4xl md:text-5xl font-medium text-brand-dark mb-4 text-left font-poppins">
                O Que Nossos Criadores Dizem
              </h2>
              <p className="text-xl text-brand-dark/80 max-w-2xl text-left font-poppins font-light">
                Histórias reais de criadores que transformaram seu conteúdo com IA
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className={`relative bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-8 md:p-12 transition-all duration-1000 delay-300 hover:shadow-2xl ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}>
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 fill-yellow-400 text-yellow-400 transition-all duration-300 hover:scale-110`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed font-poppins transition-all duration-500">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 text-lg font-poppins">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600 font-poppins">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                    className="rounded-full p-2 hover:scale-110 transition-transform duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? "bg-purple-600 scale-125" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                    className="rounded-full p-2 hover:scale-110 transition-transform duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
