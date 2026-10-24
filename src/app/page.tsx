import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { LabSection } from "@/components/sections/lab-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Full-screen Immersive Hero Section matching ThemeForest reference */}
      <HeroSection />

      {/* 2. Navigation bar for exploring sections */}
      <div className="py-6">
        <Navbar />
      </div>

      {/* 3. Detailed Works & Lab Playground */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 sm:px-6 pb-24 gap-12">
        <ProjectsSection />
        <LabSection />
        <ContactSection />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
