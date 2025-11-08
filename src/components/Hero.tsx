import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Preload video metadata for faster loading
    if (videoRef.current) {
      videoRef.current.preload = "metadata";
    }
  }, []);
  return <section id="home" className="relative overflow-hidden" style={{
    backgroundColor: '#CCCCFF'
  }}>
      {/* Mobile: Text content centered on screen */}
      <div className="lg:hidden min-h-screen flex flex-col justify-center px-4 relative">
        <div className="text-left animate-fade-in px-4">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold mb-12 leading-tight font-poppins animate-[fade-in_1s_ease-out]" style={{
          color: '#0000FF'
        }}>
            <span className="block">O Cérebro Por Trás</span>
            <span className="block">Dos Vídeos Que Viralizam</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl text-brand-dark mb-16 leading-relaxed font-poppins font-light animate-[fade-in_1.2s_ease-out]">
            A IA que carrega os frameworks responsáveis por +500 milhões de impressões orgânicas no TikTok e Instagram.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-start mb-8 animate-[fade-in_1.4s_ease-out]">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white px-12 py-6 rounded-full text-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 font-poppins">
                Começar agora
              </Button>
            </Link>
          </div>

          {/* Stats Section - Now positioned below button */}
          <div className="grid grid-cols-3 gap-2 text-left animate-[fade-in_1.6s_ease-out]">
            {[{
            number: "+500M",
            label: "Views Orgânicos",
            delay: "0s"
          }, {
            number: "R$97",
            label: "Por Mês",
            delay: "0.2s"
          }, {
            number: "100%",
            label: "Frameworks Virais",
            delay: "0.4s"
          }].map((item, index) => <div key={index} className="hover:scale-105 transition-transform duration-300" style={{
            animationDelay: item.delay
          }}>
                <div className="text-2xl font-bold text-white mb-1 font-poppins">{item.number}</div>
                <div className="text-sm text-white/80 font-poppins font-light">{item.label}</div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Mobile: Full-screen video section */}
      <div className="lg:hidden min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm">
          <div className="bg-gradient-to-br from-brand-primary via-blue-500 to-brand-secondary p-1 rounded-3xl shadow-2xl" style={{
          width: '320px',
          height: '600px',
          margin: '0 auto'
        }}>
            <div className="bg-brand-dark rounded-2xl overflow-hidden w-full h-full">
              <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover rounded-2xl">
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden lg:block min-h-[70vh] flex items-center justify-center pb-20">
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="text-left animate-fade-in">
              <div className="pl-8">
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-poppins animate-[fade-in_1s_ease-out]" style={{
                color: '#0000FF'
              }}>
                  <span className="block md:inline">O Cérebro Por Trás</span>
                  <span className="block md:inline md:before:content-[',_']">Dos Vídeos Que Viralizam</span>
                </h1>
                
                {/* Subheading */}
                <p className="text-xl text-brand-dark mb-8 leading-relaxed font-poppins font-light animate-[fade-in_1.2s_ease-out]">
                  A IA que carrega os frameworks responsáveis por +500 milhões de impressões orgânicas no TikTok e Instagram.
                </p>
                
                {/* CTA Button */}
                <div className="flex justify-start mb-8 animate-[fade-in_1.4s_ease-out]">
                  <Link to="/login">
                    <Button className="bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white px-12 py-6 rounded-full text-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 font-poppins">
                      Começar agora
                    </Button>
                  </Link>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-2 text-left animate-[fade-in_1.6s_ease-out]">
                {[{
                  number: "+500M",
                  label: "Views Orgânicos",
                  delay: "0s"
                }, {
                  number: "R$97",
                  label: "Por Mês",
                  delay: "0.2s"
                }, {
                  number: "100%",
                  label: "Frameworks Virais",
                  delay: "0.4s"
                }].map((item, index) => <div key={index} className="hover:scale-105 transition-transform duration-300" style={{
                  animationDelay: item.delay
                }}>
                  <div className="text-2xl font-bold text-white mb-1 font-poppins">{item.number}</div>
                  <div className="text-sm text-white/80 font-poppins font-light">{item.label}</div>
                </div>)}
                </div>
              </div>
            </div>
            
            {/* Right Content - Phone Mockup with Video */}
            <div className="relative flex justify-center animate-[fade-in_1.6s_ease-out] pt-8">
              {/* Phone Mockup */}
              <div className="relative max-w-xs">
                <div className="bg-gradient-to-br from-brand-primary via-blue-500 to-brand-secondary p-1 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300" style={{
                width: '260px',
                height: '480px'
              }}>
                  <div className="bg-brand-dark rounded-2xl overflow-hidden w-full h-full">
                    <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover rounded-2xl">
                      <source src="/hero-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="text-brand-dark w-8 h-8" />
          </div>
        </div>
      </div>

    </section>;
};