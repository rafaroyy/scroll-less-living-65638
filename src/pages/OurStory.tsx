
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,  
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { PopupDownload } from "@/components/PopupDownload";

const OurStory = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleJoinCommunity = () => {
    setIsDialogOpen(true);
  };

  const teamMembers = [
    {
      name: "Lino Michael Benninga",
      role: "Founder",
      bio: "5+ years working for a global tech leader, with a love for tech and the outdoors, Lino founded Social Limits after realizing how much time he was wasting on social media.",
      image: "/lovable-uploads/eb5556aa-a788-4bbf-9022-d08256edd997.png"
    },
    {
      name: "Marley Blancpain",
      role: "Advisor",
      bio: "Doctor of Medicine & a background in psychology, Marley brings a wealth of health and well-being knowledge to the table.",
      image: "/lovable-uploads/287dd284-d6a8-482d-83d0-a05c196a991e.png"
    },
    {
      name: "William Laverty",
      role: "Developer",
      bio: "With a track record being invited by Apple to WWDC 3 times, Will is our lead developer and has lead significant improvements in the overall app look and feel",
      image: "/lovable-uploads/deb98938-8fe5-453a-a4bd-859baf571023.png"
    },
    {
      name: "Vlad Poncea",
      role: "Developer",
      bio: "Talented developer, Vlad joined Social Limits and has been a key part of its growth and the smooth experience you see today.",
      image: "/lovable-uploads/f4013c37-f44b-42f8-afc9-2eeaf2791c3b.png"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Our Story - Social Limits",
    "description": "Learn about the mission behind Social Limits and meet the team helping people develop healthier digital habits through movement and mindfulness.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Social Limits",
      "founder": {
        "@type": "Person",
        "name": "Lino Michael Benninga"
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <SEO
        title="Our Story - Social Limits"
        description="Learn about the mission behind Social Limits and meet the team helping people develop healthier digital habits through movement and mindfulness."
        keywords="Social Limits story, digital wellness mission, app founders, healthy tech habits, screen time solution team"
        url="https://sociallimits.com/our-story"
        structuredData={structuredData}
      />
      <Header />
      
      {/* Header Section with more spacing */}
      <section className="py-32 bg-brand-light">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="pl-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-8 font-poppins text-left">
              What is our Mission?
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-brand-dark mb-6 font-poppins text-left">
              Help people get 1% better and healthier every morning
            </h2>
            <p className="text-lg text-brand-dark font-poppins text-left">
              Movement is the start of a great day
            </p>
          </div>
        </div>
      </section>

      {/* Team Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="pl-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-16 font-poppins text-left">
              The Team Behind Social Limits
            </h2>
          </div>
          
          {/* Team Carousel */}
          <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="p-4">
                      <div className="text-left max-w-xs">
                        {member.image && (
                          <div className="flex justify-start mb-4">
                            <img
                              src={member.image}
                              alt={`${member.name}, ${member.role} at Social Limits`}
                              className="w-24 h-32 md:w-28 md:h-36 rounded-lg object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2 font-poppins">
                          {member.name}
                        </h3>
                        <h4 className="text-base font-medium text-brand-primary mb-3 font-poppins">
                          {member.role}
                        </h4>
                        <p className="text-sm text-brand-dark leading-relaxed font-poppins">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Combined Mission, Solution, Experiment, and Research Section */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="pl-8 space-y-16">
            <div>
              <h2 className="text-lg font-medium text-brand-dark/70 mb-4 font-poppins text-left uppercase tracking-wider">
                The Mission
              </h2>
              <p className="text-lg text-brand-dark leading-relaxed font-poppins text-left">
                Our mission is to help people reclaim their time and improve their lives by fostering healthier morning routines. Leveraging my knowledge of technology, commitment to an active lifestyle, and desire to build something meaningful, Social Limits was created to make a positive impact on the world.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-brand-dark/70 mb-4 font-poppins text-left uppercase tracking-wider">
                The Solution
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-brand-dark leading-relaxed font-poppins text-left">
                  I spoke to friends/family and quickly realized I wasn't alone in this struggle. That's when the idea of Social Limits was born. I envisioned a solution that would be more intentional in helping you break free from the grip of social media, something that would almost 'force' you to follow good habits. As they say, consistency is key.
                </p>
                <p className="text-lg text-brand-dark leading-relaxed font-poppins text-left">
                  Social Limits is designed to block access to apps in the morning, requiring users to take steps—literally—to unlock them. By encouraging people to be active and engage with the world around them before diving into their digital lives, we aim to boost productivity, promote fitness, and address phone addiction.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-brand-dark/70 mb-4 font-poppins text-left uppercase tracking-wider">
                The Experiment
              </h2>
              <p className="text-lg text-brand-dark leading-relaxed font-poppins text-left">
                Determined to break this cycle, I decided to experiment with a new morning routine. Instead of reaching for my phone, I went for a walk, soaking in the early sunlight. The fresh air and light energized me, clearing my mind and setting a positive tone for the day. Unfortunately, after a couple of days, I quickly went back into the cycle of doomscrolling in the early hours of the morning. This led me to think further.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-brand-dark/70 mb-4 font-poppins text-left uppercase tracking-wider">
                The Research
              </h2>
              <p className="text-lg text-brand-dark leading-relaxed font-poppins text-left">
                Driven by curiosity and a desire for change, I dove into research. Scrolling through social media first thing in the morning was having a significant impact on my brain. The early-morning dopamine spike was setting the tone for my entire day, making me crave more dopamine hits and drawing me back to my phone repeatedly. This constant cycle was not only unproductive but also triggered my anxiety and stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 text-center">
          <Button 
            onClick={handleJoinCommunity}
            className="bg-brand-primary hover:bg-brand-secondary hover:text-brand-primary text-white px-8 py-4 text-lg font-extrabold rounded-md transition-all duration-300 font-poppins"
          >
            Join the Community
          </Button>
        </div>
      </section>

      <PopupDownload isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Footer />
    </div>
  );
};

export default OurStory;
