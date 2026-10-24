import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { LabSection } from "@/components/sections/lab-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col figma-canvas-grid selection:bg-blue-500 selection:text-white">
      {/* Top Floating Navbar */}
      <Navbar />

      {/* Main Content Frames */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto pb-24">
        <HeroSection />
        <ProjectsSection />
        <LabSection />
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
