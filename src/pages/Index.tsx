import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Overview } from "@/components/Overview";
import { Statistics } from "@/components/Statistics";
import { Features } from "@/components/Features";
import { ReviewsCollage } from "@/components/ReviewsCollage";
import { CallToAction } from "@/components/CallToAction";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { MarketplaceSection } from "@/components/MarketplaceSection";
const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
    const handleScroll = () => {
      const sections = [{
        id: "hero",
        name: "home"
      }, {
        id: "features",
        name: "how-it-works"
      }, {
        id: "overview",
        name: "overview"
      }, {
        id: "statistics",
        name: "statistics"
      }, {
        id: "testimonials",
        name: "testimonials"
      }];
      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].name);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Viralize AI",
    "description": "A IA que carrega os frameworks responsáveis por +500 milhões de impressões orgânicas. Criada por especialistas em criativos virais e vídeos de venda.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "147",
      "priceCurrency": "BRL"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": "500000000"
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <SEO title="Viralize AI - O Cérebro Por Trás Dos Vídeos Que Viralizam" description="A IA que carrega os frameworks responsáveis por +500 milhões de impressões orgânicas. Criada por especialistas em criativos virais e vídeos de venda." keywords="videos virais, frameworks de viralização, criativos virais, videos de venda, tiktok viral, instagram reels, copy visual, gatilhos de venda" structuredData={structuredData} />
      <Header activeSection={activeSection} />
      <div id="hero">
        <Hero />
      </div>
      <div id="overview">
        <Overview />
      </div>
      <div id="statistics">
        <Statistics />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="testimonials">
        
      </div>
      <MarketplaceSection />
      <CallToAction />
      <Footer />
    </div>;
};
export default Index;