import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Skills from "@/components/skills";
import ProjectsFilter from "@/components/projects-filter";
import About from "@/components/about";
import Experience from "@/components/experience";
import Certifications from "@/components/certifications";
import Testimonials from "@/components/testimonials";
import Blog from "@/components/blog";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import WhatsAppChat from "@/components/whatsapp-chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Skills />
      <ProjectsFilter />
      <About />
      <Certifications />
      <Experience />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      <WhatsAppChat />
    </div>
  );
}
