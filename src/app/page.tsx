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

      {/* Spacer to separate the full-screen void from the footer */}
      <div className="w-full h-32 md:h-48" style={{ background: "#06080F" }} />

      {/* Footer */}
      <Footer />
    </>
  );
}
