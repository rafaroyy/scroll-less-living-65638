import { useEffect, useRef, useState } from "react";

export const ReviewsCollage = () => {
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

  const reviews = [
    {
      text: "Super Effective Productivity App",
      author: "nancytran090",
      date: "Jan 12, 2025",
      stars: 5,
      content: "I feel like most people tend to use screen time on iOS to limit their social media use and increase productivity, but it's so easy to just click ignore and easily access your apps again. Downloaded this app as a busy medical student and can honestly say that it's been so helpful to stop the doom scrolling and be productive throughout the day all while getting my steps in!!",
      size: "large"
    },
    {
      text: "Great app to stop doom scrolling",
      author: "Jack45",
      date: "Feb 15, 2025",
      stars: 5,
      content: "Social Limits has reduced the hours I spend scrolling endlessly on social media. Love the idea of having to reach a step goal each day before opening Instagram. Great design, it works and awesome idea!",
      size: "medium"
    },
    {
      text: "Love it",
      author: "Arianalima__7",
      date: "Jan 10, 2025",
      stars: 5,
      content: "I absolutely love this app! It encourages me to prioritize movement, like yoga or exercise, before diving into social media. It's such a healthy routine for my mind, and it's really helping me improve my habits. Thank you so much for creating this ❤️",
      size: "medium"
    },
    {
      text: "This app genuinely changed my life",
      author: "Dason134",
      date: "Jan 12, 2025",
      stars: 5,
      content: "Saw a few influencers I follow promoting this, thought I'd download it and give it a try expecting it to be somewhat gimmicky. Honestly the best app I have on my phone. When I first downloaded it I thought I'd be walking back and forth trying to unlock my social apps, but I've actually found myself increasing the steps I need to take more and more.",
      size: "large"
    },
    {
      text: "Great app!",
      author: "Afrazier103",
      date: "Mar 20, 2025",
      stars: 5,
      content: "This app is honestly one of my new favorites. I tend to open socials for my boutique first thing in the mornings and depending on the questions/feedback it can kickstart my day the wrong way. This app sets me up for success by forcing movement before work/social media. It's truly awesome!",
      size: "medium"
    },
    {
      text: "Just wanted to let you know I really enjoyed the app as it helps me stay active and avoid using my phone first thing in the morning. The social media blocking feature has made me more productive and helps me reconnect with myself.",
      author: "Instagram user",
      date: "Recent",
      stars: 5,
      content: "",
      size: "small",
      type: "message"
    },
    {
      text: "It actually works! And I'm super burnt out right now, so forcing me to walk outside even if it's small goals, is a blessing. Thank you for having the idea and pulling through with actually creating an app for it. Cheers from Germany! ❤️",
      author: "Instagram user",
      date: "Recent",
      stars: 5,
      content: "",
      size: "small",
      type: "message"
    },
    {
      text: "Guys this is genuinely an incredible concept. So much better then just chucking a time limit on your phone.",
      author: "Instagram user",
      date: "Recent",
      stars: 5,
      content: "",
      size: "small",
      type: "message"
    },
    {
      text: "honestly app has been a gamechanger for my workflow",
      author: "Instagram user",
      date: "Recent",
      stars: 5,
      content: "",
      size: "small",
      type: "message"
    }
  ];

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 mb-2">
        {[...Array(count)].map((_, i) => (
          <span key={i} className="text-2xl">⭐</span>
        ))}
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-medium text-brand-dark mb-4 font-poppins">
            What Our Users Say
          </h2>
          <p className="text-xl text-brand-dark/80 max-w-2xl mx-auto font-poppins font-light">
            Real stories from people who've transformed their digital habits
          </p>
        </div>

        {/* Horizontal Scroll Layout */}
        <div className={`overflow-x-auto pb-6 transition-all duration-1000 delay-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex gap-6 px-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[350px] ${
                  review.type === 'message' 
                    ? 'bg-gray-100' 
                    : 'bg-white shadow-lg'
                } rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  review.size === 'large' ? 'h-[400px]' : 
                  review.size === 'medium' ? 'h-[350px]' : 
                  'h-[280px]'
                } flex flex-col`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {renderStars(review.stars)}
                
                <h3 className="text-lg font-semibold text-brand-dark mb-2 font-poppins">
                  {review.text}
                </h3>
                
                {review.content && (
                  <p className="text-gray-700 mb-4 leading-relaxed font-poppins text-sm flex-grow">
                    {review.content}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-brand-dark/80 font-poppins">
                    {review.author}
                  </span>
                  <span className="text-xs text-gray-500 font-poppins">
                    {review.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-lg text-brand-dark/70 font-poppins">
            Join <span className="font-bold text-primary">15,000+</span> users with a{" "}
            <span className="font-bold text-primary">4.8★</span> rating
          </p>
        </div>
      </div>
    </section>
  );
};
