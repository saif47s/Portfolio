import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Mail, Shield, Linkedin, Github, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@shared/schema";
import { SiMedium } from "react-icons/si";

export default function Hero() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="animate-pulse text-cyber-blue font-cyber">Loading Experience...</div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-secondary to-slate-900">
      <div className="absolute inset-0 pattern-dots opacity-20"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-cyber-blue to-cyber-green p-1 mb-8">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src={settings?.heroImage}
                alt={settings?.heroName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="text-white font-cyber">{settings?.heroName?.split(' - ')[0]}</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-green font-cyber">
            {settings?.heroTitle}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
        >
          {settings?.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            className="bg-gradient-cyber-primary hover:opacity-90 text-white font-bold py-3 px-8 text-lg shadow-lg shadow-cyber-blue/20"
            onClick={() => {
              const resumeUrl = settings?.resumeUrl || "/resume-saif-tech-expert.pdf";
              const link = document.createElement('a');
              link.href = resumeUrl;
              link.setAttribute('download', 'CV_Saif.pdf');
              link.setAttribute('target', '_blank');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
          <Button
            variant="outline"
            className="border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-white font-bold py-3 px-8 text-lg"
            onClick={() => scrollToSection("contact")}
          >
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center space-x-8"
        >
          {settings?.linkedinUrl && (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyber-blue text-3xl transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
          )}
          {settings?.githubUrl && (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyber-green text-3xl transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <Github />
            </a>
          )}
          {settings?.twitterUrl && (
            <a
              href={settings.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyber-purple text-3xl transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter />
            </a>
          )}
          {settings?.mediumUrl && (
            <a
              href={settings.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyber-yellow text-3xl transition-all hover:scale-110"
              aria-label="Medium"
            >
              <SiMedium />
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <div className="text-gray-400 text-2xl">↓</div>
      </motion.div>
    </section>
  );
}
