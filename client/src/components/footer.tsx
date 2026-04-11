import { Shield, Linkedin, Github, Twitter } from "lucide-react";
import { SiMedium } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@shared/schema";

export default function Footer() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Safe JSON parsing for footer services
  let footerServices: string[] = [];
  try {
    footerServices = settings?.footerServices ? JSON.parse(settings.footerServices) : [
      "Cybersecurity Services",
      "Cloud Engineering",
      "UI/UX Design",
      "Data Analysis & AI",
      "Mobile Development",
      "Network Engineering"
    ];
  } catch (e) {
    console.error("Error parsing footerServices:", e);
    footerServices = ["Cybersecurity Services", "Cloud Engineering", "UI/UX Design", "Data Analysis & AI", "Mobile Development", "Network Engineering"];
  }

  const staticQuickLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-cyber-dark py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-cyber-blue mr-2" />
              <span className="text-2xl font-bold text-cyber-blue font-cyber">{settings?.footerBrandName || settings?.heroName?.split(' - ')[0] || "Saif"}</span>
              <span className="text-gray-400 ml-2 font-medium">{settings?.footerBrandSubtitle || "Multi-Tech Expert"}</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md italic">
              {settings?.footerDescription || settings?.heroSubtitle || "Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development."}
            </p>
            <div className="flex space-x-6">
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-blue transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-green transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-purple transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {settings?.mediumUrl && (
                <a
                  href={settings.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-yellow transition-all hover:scale-110"
                  aria-label="Medium"
                >
                  <SiMedium className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              {footerServices.map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-cyber-blue transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {staticQuickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-cyber-blue transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {settings?.footerCopyright || "© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide."}
          </p>
          <div className="flex justify-center mt-3">
            <img 
              src="/saif_logo.png" 
              alt="Saif Logo" 
              className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
