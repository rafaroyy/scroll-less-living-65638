
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const SmarterMornings = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/lovable-uploads/f088cd0c-124c-4407-80c4-444f83204473.png";
  }, []);

  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              {/* Left Side - Image */}
              <div className="relative overflow-hidden">
                <div className={`transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <img
                    src="/lovable-uploads/f088cd0c-124c-4407-80c4-444f83204473.png"
                    alt="Person using Social Limits app while being active"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
              
              {/* Right Side - Content */}
              <div className="lg:pl-15 py-12">
                <div className="max-w-lg">
                  {/* Headline */}
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-primary mb-6 font-poppins leading-tight">
                    Start Smarter Mornings
                  </h2>
                  
                  {/* Subheadline */}
                  <h3 className="text-2xl lg:text-3xl font-medium text-brand-dark mb-6 font-poppins">
                    Reclaim your focus and build habits that last
                  </h3>
                  
                  {/* Body Text */}
                  <p className="text-lg text-brand-dark leading-relaxed mb-8 font-poppins">
                    Social Limits encourages movement before screen time by using morning app blocks that unlock only after your personalized step goal is met. This simple habit shift leads to improved mental clarity, productivity, and overall wellbeing.
                  </p>
                  
                  {/* CTA Button */}
                  <Button 
                    className="bg-brand-secondary hover:bg-brand-primary text-brand-dark hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/25 font-poppins"
                    onClick={() => window.open('https://apps.apple.com/au/app/social-limits/id6471964510', '_blank')}
                  >
                    Try It Free
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
