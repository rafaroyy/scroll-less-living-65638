
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Blog = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <SEO
        title="Blog - Social Limits"
        description="Stay updated with the latest insights on digital wellness, healthy tech habits, and tips for reducing screen time from the Social Limits team."
        keywords="digital wellness blog, screen time tips, social media addiction, healthy tech habits, productivity tips"
        url="https://sociallimits.com/blog"
      />
      <Header />
      
      {/* Coming Soon Section */}
      <section className="py-32 bg-brand-light flex items-center justify-center min-h-[60vh]">
        <div className="container mx-auto px-5 max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-primary font-poppins">
            Coming Soon!
          </h1>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
