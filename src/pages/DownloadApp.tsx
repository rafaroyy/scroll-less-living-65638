
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const DownloadApp = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Download Social Limits App",
    "description": "Download Social Limits for iOS to start your journey to healthier digital habits. Block social media apps and unlock them by taking steps.",
    "mainEntity": {
      "@type": "MobileApplication",
      "name": "Social Limits",
      "operatingSystem": "iOS",
      "downloadUrl": "https://apps.apple.com/au/app/social-limits/id6471964510"
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <SEO
        title="Download Social Limits App"
        description="Download Social Limits for iOS to start your journey to healthier digital habits. Block social media apps and unlock them by taking steps."
        keywords="download Social Limits, iOS app download, social media blocker app, screen time app, App Store"
        url="https://sociallimits.com/download-app"
        structuredData={structuredData}
      />
      <Header />
      
      {/* Download Section */}
      <section className="py-32 bg-brand-light">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-8 font-poppins">
              Download Social Limits
            </h1>
            <p className="text-xl text-brand-dark font-poppins">
              Start your journey to healthier digital habits
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-8">
            {/* App Store Button */}
            <a 
              href="https://apps.apple.com/au/app/social-limits/id6471964510" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="/lovable-uploads/7689ad82-d8a5-44dd-91ea-5040580129b8.png"
                alt="Download Social Limits on the App Store"
                className="h-16 md:h-20"
                loading="eager"
              />
            </a>
            
            {/* Google Play Button with Coming Soon */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-500 font-poppins">Coming soon</p>
              <div className="opacity-50 cursor-not-allowed">
                <img 
                  src="/lovable-uploads/bf35ef7f-983b-43bc-9aee-96bd83fd0125.png"
                  alt="Get Social Limits on Google Play - Coming Soon"
                  className="h-16 md:h-20"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DownloadApp;
