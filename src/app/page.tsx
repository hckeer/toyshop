import Navbar from "@/components/Navbar";
import ScrollStory from "@/components/ScrollStory";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* Noise texture overlay for premium depth */}
      <div className="noise-overlay" />

      {/* Fixed navbar */}
      <Navbar />

      {/* Main scroll-driven storytelling experience */}
      <main>
        <ScrollStory />
      </main>

      {/* Featured 3D Void Collection */}
      <FeaturedShowcase />

      {/* Footer */}
      <Footer />
    </>
  );
}
